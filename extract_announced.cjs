const sharp = require('sharp');
const path = require('path');

const brandDir = path.join(__dirname, 'public', 'canva_brand');
const outDir = path.join(__dirname, 'public', 'brand');

async function extractAnnounced() {
  // Crop the announced logo (middle: x: 200 to 380, y: 195 to 330)
  const crop = await sharp(path.join(brandDir, 'page_0006.png'))
    .extract({ left: 210, top: 195, width: 170, height: 135 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const rgba = Buffer.alloc(crop.info.width * crop.info.height * 4);
  for (let i = 0; i < crop.info.width * crop.info.height; i++) {
    const r = crop.data[i * 3];
    const g = crop.data[i * 3 + 1];
    const b = crop.data[i * 3 + 2];

    // Background is cream (#ece8df)
    const isCream = (r > 210 && g > 210 && b > 200 && Math.abs(r - g) < 20 && Math.abs(g - b) < 25);
    if (isCream) {
      rgba[i * 4] = 0;
      rgba[i * 4 + 1] = 0;
      rgba[i * 4 + 2] = 0;
      rgba[i * 4 + 3] = 0;
    } else {
      rgba[i * 4] = r;
      rgba[i * 4 + 1] = g;
      rgba[i * 4 + 2] = b;
      rgba[i * 4 + 3] = 255;
    }
  }

  await sharp(rgba, {
    raw: {
      width: crop.info.width,
      height: crop.info.height,
      channels: 4
    }
  })
  .trim()
  .toFile(path.join(outDir, 'sms_logo_with_stones.png'));

  console.log('Created sms_logo_with_stones.png');
}

extractAnnounced().catch(console.error);
