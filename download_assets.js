const https = require('https');
const fs = require('fs');
const path = require('path');

const teamAssets = [
  { name: 'khadija', url: 'https://slds2k25.netlify.app/assets/khadija-CfftqKgT.jpg' },
  { name: 'amine', url: 'https://slds2k25.netlify.app/assets/amine-DuzBAgj4.jpg' },
  { name: 'yasmine', url: 'https://slds2k25.netlify.app/assets/yasmine-BlO01xZE.jpg' },
  { name: 'soulaima', url: 'https://slds2k25.netlify.app/assets/sou-Dn-Qcmt5.jpg' },
  { name: 'yoser', url: 'https://slds2k25.netlify.app/assets/yoser-BffB6kAG.jpg' },
  { name: 'edam', url: 'https://slds2k25.netlify.app/assets/edam1-D3BxRIUO.jpg' },
  { name: 'zaynab', url: 'https://slds2k25.netlify.app/assets/zaynab-BCXcRgWH.jpg' },
  { name: 'may', url: 'https://slds2k25.netlify.app/assets/may-C3P5nEpj.jpg' },
  { name: 'souha', url: 'https://slds2k25.netlify.app/assets/souha-Cdr9K_tb.jpg' },
  { name: 'mohamed', url: 'https://slds2k25.netlify.app/assets/mohamed-CsUy-4eJ.jpg' },
  { name: 'sara', url: 'https://slds2k25.netlify.app/assets/sara-BtN4oP5h.jpg' }
];

const dir = path.join(__dirname, 'downloaded_assets');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

teamAssets.forEach(item => {
  const filePath = path.join(dir, `${item.name}.jpg`);
  const file = fs.createWriteStream(filePath);
  https.get(item.url, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${item.name}.jpg (${fs.statSync(filePath).size} bytes)`);
    });
  }).on('error', err => {
    console.error(`Error downloading ${item.name}:`, err.message);
  });
});
