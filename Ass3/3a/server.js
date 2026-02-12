const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = 1800;

// Complete MIME type mapping
const mimeType = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {

  const parsedUrl = url.parse(req.url);
  const reqPath = decodeURIComponent(parsedUrl.pathname);

  // Root: List all files
  if (reqPath === '/') {

    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    const files = fs.readdirSync(process.cwd());

    let fileLinks = "<h2>List of Files</h2><ul>";

    files.forEach(file => {
      if (fs.statSync(file).isFile()) {
        fileLinks += `<li><a href="/${encodeURIComponent(file)}">${file}</a></li>`;
      }
    });

    fileLinks += "</ul>";
    res.end(fileLinks);
    return;
  }

  // Prevent directory traversal
  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(process.cwd(), safePath);

  // Check if file exists
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    res.statusCode = 404;
    res.end("File Not Found");
    return;
  }

  // Get file extension
  const ext = path.extname(filePath).toLowerCase();

  // Set proper headers
  res.setHeader('Content-Type', mimeType[ext] || 'application/octet-stream');
  res.setHeader('Content-Disposition', 'inline');

  // Stream file instead of readFile
  const stream = fs.createReadStream(filePath);

  stream.on('error', () => {
    res.statusCode = 500;
    res.end("Server Error");
  });

  stream.pipe(res);

});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
