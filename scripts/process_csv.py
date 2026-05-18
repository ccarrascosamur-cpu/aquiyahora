import csv, json, re, os, urllib.request, ssl

SKIP_HANDLES = {
    'copy-of-necesers-impermeable',
    'copy-of-portacosmeticos-bag-matelasse-2',
    'ritual-prosperidad-bambu-geranios-abundancia-y-nuevos-caminos',
    'ritual-serenidad-gardenias-lilas-spa-en-casa-equilibrio-y-calma'
}

CATEGORY_MAP = {
    'Vela': 'velas',
    'Vela Aromatica': 'velas',
    'Aromatizador': 'aromatizantes',
    'DIfusor Mikado': 'difusores',
    'Aceites': 'aceites',
    'Sahumerio': 'sahumerios',
    'Sahumerio Varilla': 'sahumerios',
    'Jabones y Gel de Baño': 'jabones',
    'Body Splash': 'jabones',
    'Packs': 'sets',
    'variable': 'sets',
}

def slugify(text):
    return re.sub(r'[^a-z0-9]+', '-', text.lower().strip('-'))[:60]

def clean_html(html):
    text = re.sub(r'<[^>]+>', ' ', html)
    text = text.replace('&amp;', '&').replace('&nbsp;', ' ').replace('&quot;', '"')
    text = text.replace('&#39;', "'").replace('&lt;', '<').replace('&gt;', '>')
    text = ' '.join(text.split())
    return text.strip()

def extract_line(title, body):
    lines = ['Ceremonia de Magas', 'Alchemy', 'Exotic Destinations', 'Huerta Organica',
             'Apothecary', 'Lab', 'Premium', 'Antique', 'BLEND', 'Chic']
    for line in lines:
        if line.lower() in title.lower() or line.lower() in body.lower():
            return line
    return None

def extract_aroma(variant_name):
    parts = variant_name.split(' - ')
    if len(parts) >= 2:
        return parts[-1].strip()
    return variant_name

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
        products[handle] = {
            'handle': handle,
            'title': title,
            'description': desc,
            'type': row['Type'],
            'category': CATEGORY_MAP.get(row['Type'], 'sets'),
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

print(f'Productos a procesar: {len(products)}')

# Download images
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

downloaded = 0
failed = 0
os.makedirs('public/product-images', exist_ok=True)

for handle, p in products.items():
    for i, img_url in enumerate(p['images'][:2]):  # Max 2 images per product
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

# Generate TypeScript
output = "import type { Product } from '@/types/product';\n\nexport const PRODUCTS: Product[] = [\n"

for handle, p in products.items():
    aromas = [extract_aroma(v['name']) for v in p['variants']]
    aromas = list(dict.fromkeys(aromas))  # deduplicate
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

print(f'\nGenerated src/data/products.ts with {len(products)} products')
