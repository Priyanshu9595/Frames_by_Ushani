const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({ 
  cloud_name: 'dhfyfbxiv', 
  api_key: '758619196555259', 
  api_secret: 'yoacZsqiIxSY0C9HExUYY7AChmk' 
});

const videosToUpload = [
  { path: 'images/corparate teasers/corparate teasers/01.main teaser.mov', category: 'corparate teasers' },
  { path: 'images/corparate teasers/corparate teasers/02.mp4', category: 'corparate teasers' },
  { path: 'images/Reels/reels/Copy of 0523.mov', category: 'Reels' },
  { path: 'images/Reels/reels/Copy of 0526 (1)(2).MOV', category: 'Reels' },
  { path: 'images/Reels/reels/Copy of IMG_3216.mov', category: 'Reels' },
  { path: 'images/wedding teasers/wedding teasers/01.mp4', category: 'wedding teasers' },
  { path: 'images/wedding teasers/wedding teasers/Copy of Ambika Reddy Vittal Reddy 2.MOV', category: 'wedding teasers' }
];

const imagesDataPath = path.join(__dirname, 'src', 'data', 'images.json');

async function uploadLargeVideos() {
  let data = JSON.parse(fs.readFileSync(imagesDataPath, 'utf8'));

  for (const item of videosToUpload) {
    const fullPath = path.join(__dirname, item.path);
    const fileName = path.basename(item.path);
    const category = item.category;

    if (!fs.existsSync(fullPath)) {
      console.log(`File not found: ${fullPath}`);
      continue;
    }

    if (!data[category]) data[category] = [];
    
    if (data[category].some(v => v.name === fileName)) {
      console.log(`Skipping ${fileName}, already uploaded.`);
      continue;
    }

    console.log(`Uploading large video ${fileName}... Size: ${(fs.statSync(fullPath).size / (1024*1024)).toFixed(2)} MB`);
    try {
      const result = await cloudinary.uploader.upload_large(fullPath, {
        resource_type: "video",
        folder: `frames_by_ushani/${category}`,
        chunk_size: 6000000 // 6MB chunks
      });

      data[category].push({
        name: fileName,
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height
      });
      console.log(`Uploaded successfully: ${result.secure_url}`);
    } catch (err) {
      console.error(`Failed to upload ${fileName}:`, err);
    }
  }

  fs.writeFileSync(imagesDataPath, JSON.stringify(data, null, 2));
  console.log(`Successfully updated image data with large videos`);
}

uploadLargeVideos();
