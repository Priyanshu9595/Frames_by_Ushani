const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data', 'images.json');
const data = require(dataPath);

let removedCount = 0;

if (data['corprate photos']) {
  const initialLength = data['corprate photos'].length;
  data['corprate photos'] = data['corprate photos'].filter(item => item.name !== '1679761464652 2.jpg');
  removedCount += initialLength - data['corprate photos'].length;
}

if (removedCount > 0) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  console.log(`Removed ${removedCount} duplicates.`);
} else {
  console.log('No duplicates found to remove.');
}
