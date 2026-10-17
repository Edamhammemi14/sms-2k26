const fs = require('fs');
const https = require('https');
const path = require('path');

const html = fs.readFileSync('canva_view.html', 'utf-8');

const dir = path.join(__dirname, 'public', 'canva_brand');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Find all document-image URLs
const urlRegex = /https:\/\/media\.canva\.com\/v2\/document-image\/[^"'\s]+/g;
const urls = [...new Set(html.match(urlRegex) || [])];

console.log(`Found ${urls.length} Canva document image URLs.`);

async function download(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (redirectRes) => {
          const file = fs.createWriteStream(filename);
          redirectRes.pipe(file);
          file.on('finish', () => { file.close(); resolve(); });
        }).on('error', reject);
        return;
      }
      if (res.statusCode !== 200) {
        // Fallback to S3 URL inside query string if present
        const match = url.match(/fallback=([^&]+)/);
        if (match) {
          const fallbackUrl = decodeURIComponent(match[1]);
          https.get(fallbackUrl, (fbRes) => {
            const file = fs.createWriteStream(filename);
            fbRes.pipe(file);
            file.on('finish', () => { file.close(); resolve(); });
          }).on('error', reject);
          return;
        }
        return resolve();
      }
      const file = fs.createWriteStream(filename);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      console.error('Error downloading:', err.message);
      resolve();
    });
  });
}

async function run() {
  for (let i = 0; i < urls.length; i++) {
    const u = urls[i];
    // extract page number if possible
    const pageMatch = u.match(/thumbnail%2F(\d+)\.png/) || u.match(/preview%2F(\d+)\.png/) || u.match(/thumbnail\/(\d+)\.png/);
    const pageNum = pageMatch ? pageMatch[1] : `img_${i + 1}`;
    const isPreview = u.includes('type:C') || u.includes('preview');
    const dest = path.join(dir, `page_${pageNum}${isPreview ? '_hq' : ''}.png`);
    console.log(`Downloading ${pageNum} -> ${path.basename(dest)}...`);
    await download(u, dest);
  }
  console.log('Finished downloading all Canva slides!');
}

run();
