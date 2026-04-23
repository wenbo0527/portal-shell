/**
 * Portal Shell 生产服务器
 * 用途：静态文件服务 + API 代理
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8000;
const API_PROXY = process.env.API_PROXY || 'http://localhost:8080';
const DIST_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.json': 'application/json',
};

function getMime(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function handleRequest(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = req.url.split('?')[0];

  // API 代理
  if (url.startsWith('/api/')) {
    const target = `${API_PROXY}${url}`;
    console.log(`[proxy] ${req.method} ${url} -> ${target}`);
    const proxyReq = http.request(target, { method: req.method, headers: req.headers }, (proxyRes) => {
      let body = '';
      proxyRes.on('data', chunk => body += chunk);
      proxyRes.on('end', () => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        res.end(body);
      });
    });
    proxyReq.on('error', (e) => {
      console.error(`[proxy] Error: ${e.message}`);
      res.writeHead(502);
      res.end('Proxy error');
    });
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      req.pipe(proxyReq);
    } else {
      proxyReq.end();
    }
    return;
  }

  // 静态文件服务（SPA fallback）
  let filePath = path.join(DIST_DIR, url);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, {
      'Content-Type': getMime(filePath),
      'Cache-Control': 'public, max-age=3600',
    });
    res.end(content);
    return;
  }

  // SPA fallback → index.html
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync(indexPath));
    return;
  }

  res.writeHead(404);
  res.end('Not found');
}

const server = http.createServer(handleRequest);
server.listen(PORT, '0.0.0.0', () => {
  console.log(`[shell-server] Static dir: ${DIST_DIR}`);
  console.log(`[shell-server] API proxy: ${API_PROXY}`);
  console.log(`[shell-server] Running on http://localhost:${PORT}`);
});