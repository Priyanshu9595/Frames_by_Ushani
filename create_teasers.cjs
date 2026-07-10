const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data', 'images.json');
let data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Find all videos across all categories
const allVideos = [];
for (const key of Object.keys(data)) {
  for (const item of data[key]) {
    if (item.name && item.name.match(/\.(mp4|mov)$/i)) {
      if (!allVideos.some(v => v.name === item.name)) {
        allVideos.push(item);
      }
    }
  }
}

// Create Teasers category
data.Teasers = allVideos;

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log(`Added ${allVideos.length} videos to Teasers category.`);
