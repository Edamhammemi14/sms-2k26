const sharp = require('sharp');
const path = require('path');

const brandDir = path.join(__dirname, 'public', 'canva_brand');
const outDir = path.join(__dirname, 'public', 'brand');
const fs = require('fs');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function extractLogos() {
  // 1. Process page_0002.png (Gold graphic logo on white)
  const img2 = sharp(path.join(brandDir, 'page_0002.png'));
  const { data: raw2, info: info2 } = await img2.raw().toBuffer({ resolveWithObject: true });

  // Create RGBA buffer where pixels close to white become transparent
  const rgba2 = Buffer.alloc(info2.width * info2.height * 4);
  for (let i = 0; i < info2.width * info2.height; i++) {
    const r = raw2[i * 3];
    const g = raw2[i * 3 + 1];
    const b = raw2[i * 3 + 2];

    // Check if pixel is white/light background
    if (r > 240 && g > 240 && b > 240) {
      rgba2[i * 4] = 0;
      rgba2[i * 4 + 1] = 0;
      rgba2[i * 4 + 2] = 0;
      rgba2[i * 4 + 3] = 0; // transparent
    } else {
      rgba2[i * 4] = r;
      rgba2[i * 4 + 1] = g;
      rgba2[i * 4 + 2] = b;
      rgba2[i * 4 + 3] = 255;
    }
  }

  await sharp(rgba2, {
    raw: {
      width: info2.width,
      height: info2.height,
      channels: 4,
    },
  })
    .trim() // Trim transparent bounding box
    .toFile(path.join(outDir, 'sms_logo_gold.png'));

  console.log('Created sms_logo_gold.png');

  // 2. Process page_0003.png (Metallic shaded gold logo on cream)
  const img3 = sharp(path.join(brandDir, 'page_0003.png'));
  const { data: raw3, info: info3 } = await img3.raw().toBuffer({ resolveWithObject: true });

  const rgba3 = Buffer.alloc(info3.width * info3.height * 4);
  for (let i = 0; i < info3.width * info3.height; i++) {
    const r = raw3[i * 3];
    const g = raw3[i * 3 + 1];
    const b = raw3[i * 3 + 2];

    // Background is cream: r: 236, g: 232, b: 223
    const isCream = (r > 220 && g > 215 && b > 200 && Math.abs(r - g) < 20 && Math.abs(g - b) < 25);
    if (isCream) {
      rgba3[i * 4] = 0;
      rgba3[i * 4 + 1] = 0;
      rgba3[i * 4 + 2] = 0;
      rgba3[i * 4 + 3] = 0;
    } else {
      rgba3[i * 4] = r;
      rgba3[i * 4 + 1] = g;
      rgba3[i * 4 + 2] = b;
      rgba3[i * 4 + 3] = 255;
    }
  }

  await sharp(rgba3, {
    raw: {
      width: info3.width,
      height: info3.height,
      channels: 4,
    },
  })
    .trim()
    .toFile(path.join(outDir, 'sms_logo_metallic.png'));

  console.log('Created sms_logo_metallic.png');

  // 3. Process page_0006.png to crop the announced logo with 6 stones
  // On slide 6 (586x341):
  // The announced logo with stones is in bottom row:
  // middle column is announced main variation on cream
  // right column is announced black variation on gold
  // left column is announced white variation on dark gold
  // Let's crop the bottom-left announced white variation:
  // x: 20 to 180, y: 190 to 330
  const cropWhiteStones = await sharp(path.join(brandDir, 'page_0006.png'))
    .extract({ left: 25, top: 185, width: 170, height: 145 })
    .toFile(path.join(outDir, 'sms_logo_stones_badge.png'));

  console.log('Created sms_logo_stones_badge.png');

  // 4. Save the epic cosmic poster from page_0015.png
  await sharp(path.join(brandDir, 'page_0015.png'))
    .resize(1920, 1080, { fit: 'cover' })
    .toFile(path.join(outDir, 'cosmic_sfax_hero.jpg'));

  console.log('Created cosmic_sfax_hero.jpg');

  // 5. Save the visual charter overview from page_0009.png
  await sharp(path.join(brandDir, 'page_0009.png'))
    .toFile(path.join(outDir, 'visual_charter_full.png'));

  console.log('Created visual_charter_full.png');
}

extractLogos().catch(console.error);
