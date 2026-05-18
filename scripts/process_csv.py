import csv, re, os, urllib.request, ssl

SKIP_HANDLES = {
    'copy-of-necesers-impermeable',
    'copy-of-portacosmeticos-bag-matelasse-2',
}

def clean_html(html):
    text = re.sub(r'<[^>]+>', ' ', html)
    text = text.replace('&amp;', '&').replace('&nbsp;', ' ').replace('&quot;', '"')
    text = text.replace('&#39;', "'").replace('&lt;', '<').replace('&gt;', '>')
    text = ' '.join(text.split())
    return text.strip()

def extract_aroma(variant_name):
    parts = variant_name.split(' - ')
    if len(parts) >= 2:
        return parts[-1].strip()
    return variant_name

def get_category(handle, title, product_category, product_type):
    h = handle.lower()
    t = title.lower()
    
    # Repuestos first
    if 'repuesto' in h or 'repuesto' in t:
        return 'repuestos'
    
    # Velas
    if any(x in h for x in ['vela', 'velon', 'velas']):
        return 'velas'
    
    # Aromatizantes (sprays)
    if any(x in h for x in ['aromatizante', 'aromatizantes']) and 'difusor' not in h:
        return 'aromatizantes'
    
    # Difusores
    if any(x in h for x in ['difusor', 'difusores']):
        return 'difusores'
    
    # Aceites
    if 'aceite' in h:
        return 'aceites'
    
    # Sahumerios
    if 'sahumerio' in h:
        return 'sahumerios'
    
    # Jabones
    if any(x in h for x in ['jabon', 'body-splash']):
        return 'jabones'
    
    # Sets/Packs (true gift sets)
    if any(x in h for x in ['set-', 'sets-', 'pack-', 'ritual-']):
        return 'sets'
    
    # Fallback based on Shopify Product Category
    cat = product_category.lower()
    if 'candle' in cat:
        return 'velas'
    if 'air freshener' in cat or 'aromat' in cat:
        return 'aromatizantes'
    if 'diffuser' in cat:
        return 'difusores'
    if 'fragrance oil' in cat:
        return 'aceites'
    if 'incense' in cat:
        return 'sahumerios'
    if 'soap' in cat or 'body' in cat:
        return 'jabones'
    if 'gift' in cat:
        return 'sets'
    
    return 'sets'

def extract_line(title, body):
    lines = ['Ceremonia de Magas', 'Alchemy', 'Exotic Destinations', 'Huerta Organica',
             'Apothecary', 'Lab', 'Premium', 'Antique', 'BLEND', 'Chic']
    for line in lines:
        if line.lower() in title.lower() or line.lower() in body.lower():
            return line
    return None

f = open('products_export.csv', 'r', encoding='utf-8')
reader = csv.DictReader(f)

products = {}
for row in reader:
    handle = row['Handle']
    if not handle or handle in SKIP_HANDLES:
        continue
    if handle not in products:
        title = row['Title'].replace(' - Aquí & Ahora', '').replace(' - Aqui & Ahora', '').strip()
        body = clean_html(row['Body (HTML)'])
        desc = body[:350] if body else ''
        category = get_category(handle, row['Title'], row['Product Category'], row['Type'])
        
        products[handle] = {
            'handle': handle,
            'title': title,
            'description': desc,
            'category': category,
            'images': [],
            'variants': [],
            'line': extract_line(title, row['Body (HTML)'])
        }
    img = row['Image Src']
    if img and img not in products[handle]['images']:
        products[handle]['images'].append(img)
    variant = row['Option1 Value']
    if variant and variant not in [v['name'] for v in products[handle]['variants']]:
        products[handle]['variants'].append({'name': variant})

f.close()

# Print category summary
from collections import Counter
cats = Counter([p['category'] for p in products.values()])
print('Categorias:')
for cat, count in sorted(cats.items()):
    print(f'  {cat}: {count}')
print(f'\nTotal: {len(products)}')

# Download images
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

downloaded = 0
failed = 0
os.makedirs('public/product-images', exist_ok=True)

for handle, p in products.items():
    for i, img_url in enumerate(p['images'][:2]):
        ext = img_url.split('?')[0].split('.')[-1]
        if ext not in ['jpg', 'jpeg', 'png', 'webp']:
            ext = 'jpg'
        filename = f'{handle}-{i+1}.{ext}'
        filepath = f'public/product-images/{filename}'
        if os.path.exists(filepath):
            continue
        try:
            req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, context=ctx, timeout=30) as response:
                with open(filepath, 'wb') as out:
                    out.write(response.read())
            downloaded += 1
            print(f'Downloaded: {filename}')
        except Exception as e:
            failed += 1
            print(f'Failed: {filename} - {str(e)[:60]}')

print(f'\nDownloaded: {downloaded}, Failed: {failed}')

# Update types/product.ts to add 'repuestos' category
with open('src/types/product.ts', 'r', encoding='utf-8') as f:
    types_content = f.read()

if 'repuestos' not in types_content:
    types_content = types_content.replace(
        "export type Category = 'velas' | 'aromatizantes' | 'difusores' | 'aceites' | 'sahumerios' | 'jabones' | 'sets' | 'papeleria';",
        "export type Category = 'velas' | 'aromatizantes' | 'difusores' | 'aceites' | 'sahumerios' | 'jabones' | 'sets' | 'papeleria' | 'repuestos';"
    )
    # Add repuestos to CATEGORIES array
    repuestos_entry = """  {
    slug: 'repuestos',
    name: 'Repuestos',
    nameEn: 'Refills',
    icon: 'RefreshCw',
    count: 2,
    image: '/category-repuestos.jpg',
    gradient: 'from-green-50/80 to-cream',
  },"""
    types_content = types_content.replace(
        'export const CATEGORY_LABELS',
        f'{repuestos_entry}\n\nexport const CATEGORY_LABELS'
    )
    # Add to labels
    types_content = types_content.replace(
        "  papeleria: 'Papelería',\n};",
        "  papeleria: 'Papelería',\n  repuestos: 'Repuestos',\n};"
    )
    with open('src/types/product.ts', 'w', encoding='utf-8') as f:
        f.write(types_content)
    print('Updated types/product.ts with repuestos category')

# Generate TypeScript
output = "import type { Product } from '@/types/product';\n\nexport const PRODUCTS: Product[] = [\n"

for handle, p in products.items():
    aromas = [extract_aroma(v['name']) for v in p['variants']]
    aromas = list(dict.fromkeys(aromas))
    # Filter out "Default Title"
    aromas = [a for a in aromas if a != 'Default Title']
    aromas_str = ', '.join([f"'{a}'" for a in aromas])
    
    img_path = f"/product-images/{handle}-1.jpg"
    line_str = f"\n    line: '{p['line']}'," if p['line'] else ''
    
    output += f"""  {{
    id: '{handle}',
    name: '{p['title'].replace("'", "\\'")}',
    category: '{p['category']}',
    description: '{p['description'].replace("'", "\\'")[:280]}',{line_str}
    aromas: [{aromas_str}],
    image: '{img_path}',
  }},
"""

output += "];\n\nexport const PRODUCT_COUNT = PRODUCTS.length;\n"

with open('src/data/products.ts', 'w', encoding='utf-8') as f:
    f.write(output)

print(f'Generated src/data/products.ts with {len(products)} products')
