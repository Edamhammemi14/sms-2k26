const fs = require('fs');
const content = fs.readFileSync('reference-bundle.js', 'utf8');

// Find Easter egg function s()
const eggIdx = content.indexOf('c.join("")===r&&s()');
if (eggIdx !== -1) {
  console.log('\n--- Easter egg snippet ---');
  console.log(content.slice(eggIdx - 300, eggIdx + 300));
}

// Print full 'What Awaits You' card 3
const awaits3Idx = content.indexOf('3. ');
if (awaits3Idx !== -1) {
  console.log('\n--- What Awaits You card 3 ---');
  console.log(content.slice(awaits3Idx - 30, awaits3Idx + 400));
}
