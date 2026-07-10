const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data', 'images.json');
const data = require(dataPath);

let removedCount = 0;

// Clean up Corporate duplicates
if (data.Corporate) {
  const originalLength = data.Corporate.length;
  data.Corporate = data.Corporate.filter(img => {
    // If it's a (1) or " 2" file, check if the base file exists
    if (img.name.includes('(1)')) {
      const baseName = img.name.replace('(1)', '');
      if (data.Corporate.some(i => i.name === baseName)) return false;
    }
    if (img.name.includes(' 2.')) {
      const baseName = img.name.replace(' 2.', '.');
      if (data.Corporate.some(i => i.name.toLowerCase() === baseName.toLowerCase())) return false;
    }
    return true;
  });
  removedCount += (originalLength - data.Corporate.length);
}

// Clean up Wedding burst shots
if (data.Wedding) {
  const originalLength = data.Wedding.length;
  // keep only the first and last of the BIT sequence
  const bitImages = data.Wedding.filter(i => i.name.includes('BIT'));
  if (bitImages.length > 2) {
    const toKeep = [bitImages[0].name, bitImages[bitImages.length - 1].name];
    data.Wedding = data.Wedding.filter(img => {
      if (img.name.includes('BIT')) {
        return toKeep.includes(img.name);
      }
      return true;
    });
  }
  removedCount += (originalLength - data.Wedding.length);
}

// Check other categories just in case
Object.keys(data).forEach(cat => {
    if (cat === 'Corporate' || cat === 'Wedding') return;
    const originalLength = data[cat].length;
    data[cat] = data[cat].filter((img, index, self) => 
        index === self.findIndex((t) => t.name === img.name)
    );
    removedCount += (originalLength - data[cat].length);
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log(`Removed ${removedCount} duplicate/burst images.`);
