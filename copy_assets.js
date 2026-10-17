const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'downloaded_assets');
const destDir = path.join(__dirname, 'public', 'assets', 'team');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

if (fs.existsSync(srcDir)) {
  const files = fs.readdirSync(srcDir);
  files.forEach(file => {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
    console.log(`Copied ${file} to public/assets/team/`);
  });
}
console.log('Finished copying assets.');
