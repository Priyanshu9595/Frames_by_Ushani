const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data', 'images.json');
const data = require(dataPath);

let updated = 0;

if (data.Reels) {
  data.Reels.forEach(item => {
    if ((item.name === 'Copy of 0523.mov' || item.name === 'Copy of 0526 (1)(2).MOV') && !item.url.includes('a_270')) {
      item.url = item.url.replace('/video/upload/v', '/video/upload/a_270/v');
      // swap width and height
      const temp = item.width;
      item.width = item.height;
      item.height = temp;
      updated++;
    }
  });
}

if (updated > 0) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  console.log(`Updated ${updated} videos.`);
} else {
  console.log('No videos needed update.');
}
