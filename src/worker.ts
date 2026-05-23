import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

export interface Env {
  __STATIC_CONTENT: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      return await getAssetFromKV(
        {
          request,
          waitUntil: (promise: Promise<any>) => promise,
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
        }
      );
    } catch (e) {
      // Fallback to index.html for SPA routing
      return getAssetFromKV(
        {
          request: new Request(new URL('/index.html', request.url)),
          waitUntil: (promise: Promise<any>) => promise,
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
        }
      );
    }
  },
};
