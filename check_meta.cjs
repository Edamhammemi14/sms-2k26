const sharp = require('sharp');
const path = require('path');

const brandDir = path.join(__dirname, 'public', 'canva_brand');

async function checkMetadata() {
  const files = ['page_0001.png', 'page_0002.png', 'page_0003.png', 'page_0006.png', 'page_0009.png', 'page_0010.png', 'page_0011.png', 'page_0015.png'];
  for (const f of files) {
    const meta = await sharp(path.join(brandDir, f)).metadata();
    console.log(`${f}: ${meta.width}x${meta.height}, channels: ${meta.channels}`);
  }
}

checkMetadata();
