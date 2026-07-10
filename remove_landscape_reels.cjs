const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data', 'images.json');
const data = require(dataPath);

let removed = 0;

if (data.Reels) {
  const originalLength = data.Reels.length;
  data.Reels = data.Reels.filter(item => {
    // Remove the two videos that were originally landscape
    if (item.name === 'Copy of 0523.mov' || item.name === 'Copy of 0526 (1)(2).MOV') {
      return false;
    }
    return true;
  });
  removed = originalLength - data.Reels.length;
}

if (removed > 0) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  console.log(`Removed ${removed} landscape videos from Reels.`);
} else {
  console.log('No videos removed.');
}
