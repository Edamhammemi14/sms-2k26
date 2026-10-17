const sharp = require('sharp');
const path = require('path');

const brandDir = path.join(__dirname, 'public', 'canva_brand');
const outDir = path.join(__dirname, 'public', 'brand');

async function extractTextures() {
  // Extract individual textures from page_0011.png (width: 586, height: 341)
  // 3 columns, 4 rows:
  // col width ~ 195, row height ~ 85
  const colW = Math.floor(586 / 3);
  const rowH = Math.floor(341 / 4);

  // 1. Obsidian with gold veins (col 1, row 0)
  await sharp(path.join(brandDir, 'page_0011.png'))
    .extract({ left: colW, top: 0, width: colW, height: rowH })
    .resize(800, 450)
    .toFile(path.join(outDir, 'texture_obsidian_gold.jpg'));

  // 2. Cosmic purple nebula (col 0, row 2)
  await sharp(path.join(brandDir, 'page_0011.png'))
    .extract({ left: 0, top: rowH * 2, width: colW, height: rowH })
    .resize(800, 450)
    .toFile(path.join(outDir, 'texture_purple_nebula.jpg'));

  // 3. Golden astral dust (col 1, row 3)
  await sharp(path.join(brandDir, 'page_0011.png'))
    .extract({ left: colW, top: rowH * 3, width: colW, height: rowH })
    .resize(800, 450)
    .toFile(path.join(outDir, 'texture_cosmic_dust.jpg'));

  // 4. Golden lightning stream (col 2, row 2)
  await sharp(path.join(brandDir, 'page_0011.png'))
    .extract({ left: colW * 2, top: rowH * 2, width: colW, height: rowH })
    .resize(800, 450)
    .toFile(path.join(outDir, 'texture_golden_stream.jpg'));

  // 5. The epic Sfax Cosmic Skyline from page_0015.png (resized for crisp full-width display)
  await sharp(path.join(brandDir, 'page_0015.png'))
    .resize(1920, 1080, { fit: 'cover' })
    .toFile(path.join(outDir, 'sfax_cosmic_landscape.jpg'));

  // 6. VIP Gold Ticket from page_0014.png
  await sharp(path.join(brandDir, 'page_0014.png'))
    .toFile(path.join(outDir, 'vip_invitation_ticket.png'));

  console.log('Textures extracted successfully!');
}

extractTextures().catch(console.error);
