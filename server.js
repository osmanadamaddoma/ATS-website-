const http = require('http');
const fs = require('fs');
const path = require('path');
const root = __dirname;
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon'};
const pageRoutes = new Set(['/','/about','/services','/work','/gallery','/videos','/contact']);
const server = http.createServer((req,res)=>{
  let requested = decodeURIComponent((req.url||'/').split('?')[0]);
  if(requested === '/manus-routes.json') requested = '/public/manus-routes.json';
  if(requested === '/logo-ats.jpg') requested = '/public/logo-ats.jpg';
  if(pageRoutes.has(requested)) requested = '/index.html';
  const file = path.join(root, requested);
  if(!file.startsWith(root)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(file,(err,data)=>{
    if(err){res.writeHead(404,{'Content-Type':'text/plain'});return res.end('Not found')}
    res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data);
  });
});
const port = Number(process.env.PORT||3000);
server.listen(port,'0.0.0.0',()=>console.log(`ATS site listening on ${port}`));
