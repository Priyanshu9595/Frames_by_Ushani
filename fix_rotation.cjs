const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data', 'images.json');
const data = require(dataPath);

let updated = 0;

if (data.Wedding) {
  data.Wedding.forEach(item => {
    if (item.name.includes('BIT') && item.url.includes('/image/upload/v')) {
      item.url = item.url.replace('/image/upload/v', '/image/upload/a_90/v');
      // swap width and height since we rotated it 90 degrees!
      const temp = item.width;
      item.width = item.height;
      item.height = temp;
      updated++;
    }
  });
}

if (updated > 0) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  console.log(`Updated ${updated} images.`);
} else {
  console.log('No images needed update.');
}
