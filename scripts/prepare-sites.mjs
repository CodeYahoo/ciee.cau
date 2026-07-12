import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { extname, relative, resolve } from 'node:path'

const distRoot = resolve('dist')
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
}

async function collectFiles(directory) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === 'server' || entry.name === '.openai') continue
    const absolute = resolve(directory, entry.name)
    if (entry.isDirectory()) files.push(...await collectFiles(absolute))
    else files.push(absolute)
  }
  return files
}

const embedded = {}
for (const absolute of await collectFiles(distRoot)) {
  const path = `/${relative(distRoot, absolute).replaceAll('\\', '/')}`
  const data = await readFile(absolute)
  embedded[path] = {
    body: data.toString('base64'),
    type: mimeTypes[extname(path)] || 'application/octet-stream',
  }
}

const worker = `
const files = ${JSON.stringify(embedded)};
const decode = value => Uint8Array.from(atob(value), character => character.charCodeAt(0));
const safeJson = value => JSON.stringify(value).replace(/</g, '\\\\u003c');
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname === '/' ? '/index.html' : url.pathname;
    let file = files[path];
    if (!file && request.method === 'GET' && !path.includes('.')) file = files['/index.html'];
    if (!file) return new Response('Not found', { status: 404 });
    if (file.type.startsWith('text/html')) {
      let html = new TextDecoder().decode(decode(file.body));
      const config = { AMAP_KEY: env.VITE_AMAP_KEY || '', AMAP_SECURITY_CODE: env.VITE_AMAP_SECURITY_CODE || '' };
      html = html.replace('</head>', '<script>window.__APP_CONFIG__=' + safeJson(config) + '</script></head>');
      return new Response(html, { headers: { 'content-type': file.type, 'cache-control': 'no-store' } });
    }
    return new Response(decode(file.body), { headers: { 'content-type': file.type, 'cache-control': 'public, max-age=31536000, immutable' } });
  }
};
`

await mkdir('dist/server', { recursive: true })
await mkdir('dist/.openai', { recursive: true })
await writeFile('dist/server/index.js', worker)
await copyFile('.openai/hosting.json', 'dist/.openai/hosting.json')
