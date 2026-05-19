import { useState, useEffect, useCallback } from 'react';

const REPO = 'ccarrascosamur-cpu/aquiyahora';
const BRANCH = 'main';
const CONFIG_FILE = 'app/public/site-config.json';
const TOKEN_KEY = 'github_admin_token';

export interface SiteConfig {
  heroImage: string | null;
  aboutImage: string | null;
  heroVideo: string | null;
}

const DEFAULTS: SiteConfig = {
  heroImage: '/hero-lifestyle.jpg',
  aboutImage: '/about-showcase.jpg',
  heroVideo: null,
};

async function ghGet(path: string, token: string) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } }
  );
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${res.statusText}`);
  return res.json() as Promise<{ sha: string; content: string }>;
}

async function ghPut(
  path: string,
  base64Content: string,
  sha: string | null,
  token: string,
  message: string
) {
  const body: Record<string, unknown> = { message, content: base64Content, branch: BRANCH };
  if (sha) body.sha = sha;
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(err.message || `GitHub ${res.status}`);
  }
}

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULTS);
  const [githubToken, setGithubTokenState] = useState<string>(
    () => localStorage.getItem(TOKEN_KEY) || ''
  );

  useEffect(() => {
    fetch(`/site-config.json?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then((data: Partial<SiteConfig>) => setConfig(prev => ({ ...prev, ...data })))
      .catch(() => {});
  }, []);

  const saveGithubToken = useCallback((token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    setGithubTokenState(token);
  }, []);

  const patchConfig = useCallback(async (updates: Partial<SiteConfig>) => {
    if (!githubToken) throw new Error('Token de GitHub no configurado');

    let sha: string | null = null;
    let current: SiteConfig = config;
    try {
      const file = await ghGet(CONFIG_FILE, githubToken);
      sha = file.sha;
      current = JSON.parse(atob(file.content.replace(/\n/g, '')));
    } catch {
      // file doesn't exist yet, will be created
    }

    const next: SiteConfig = { ...DEFAULTS, ...current, ...updates };
    await ghPut(CONFIG_FILE, btoa(JSON.stringify(next, null, 2)), sha, githubToken, 'admin: actualizar configuración');
    setConfig(next);
  }, [config, githubToken]);

  const uploadSiteImage = useCallback(async (key: 'heroImage' | 'aboutImage', dataUrl: string) => {
    if (!githubToken) throw new Error('Token de GitHub no configurado');
    const base64 = dataUrl.split(',')[1];
    const ext = (dataUrl.match(/data:image\/(\w+)/)?.[1] ?? 'jpeg').replace('jpeg', 'jpg');
    const filename = `${key}-${Date.now()}.${ext}`;
    await ghPut(`app/public/uploads/${filename}`, base64, null, githubToken, `admin: subir imagen ${key}`);
    await patchConfig({ [key]: `/uploads/${filename}` });
  }, [githubToken, patchConfig]);

  const resetSiteImage = useCallback(async (key: 'heroImage' | 'aboutImage') => {
    await patchConfig({ [key]: null });
  }, [patchConfig]);

  const setHeroVideo = useCallback(async (url: string | null) => {
    await patchConfig({ heroVideo: url });
  }, [patchConfig]);

  return {
    config,
    githubToken,
    saveGithubToken,
    uploadSiteImage,
    resetSiteImage,
    setHeroVideo,
    getImage: (key: 'heroImage' | 'aboutImage'): string => config[key] || DEFAULTS[key] || '',
    getHeroVideo: (): string | null => config.heroVideo,
  };
}
