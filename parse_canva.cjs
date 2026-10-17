const fs = require('fs');

const html = fs.readFileSync('canva_view.html', 'utf-8');

// Title
const titleMatch = html.match(/<title>([^<]+)<\/title>/);
console.log('Title:', titleMatch ? titleMatch[1] : 'None');

// OpenGraph Image
const ogMatch = html.match(/property="og:image"\s+content="([^"]+)"/);
console.log('og:image:', ogMatch ? ogMatch[1] : 'None');

// Twitter Image
const twMatch = html.match(/name="twitter:image"\s+content="([^"]+)"/);
console.log('twitter:image:', twMatch ? twMatch[1] : 'None');

// Look for image URLs
const imgRegex = /https:\/\/[^"'<>\s]+\.(?:png|jpg|jpeg|webp|svg)/gi;
const allImgs = [...new Set(html.match(imgRegex) || [])];
console.log('\nTotal image links:', allImgs.length);
allImgs.forEach(url => {
  if (url.includes('canva') || url.includes('media') || url.includes('document')) {
    console.log(' - ' + url);
  }
});

// Search for strings like colors or text content
const hexColors = [...new Set(html.match(/#[0-9a-fA-F]{6}\b/g) || [])];
console.log('\nFound hex colors count:', hexColors.length);
console.log('Colors:', hexColors.slice(0, 20).join(', '));
