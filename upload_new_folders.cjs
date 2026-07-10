const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({ 
  cloud_name: 'dhfyfbxiv', 
  api_key: '758619196555259', 
  api_secret: 'yoacZsqiIxSY0C9HExUYY7AChmk' 
});

const foldersToUpload = [
  { path: 'images/coorporate1', category: 'Corporate' },
  { path: 'images/Wedding1', category: 'Wedding' },
  { path: 'images/Reels1', category: 'Reels' }
];

const imagesDataPath = path.join(__dirname, 'src', 'data', 'images.json');

async function uploadNewFolders() {
  let data = JSON.parse(fs.readFileSync(imagesDataPath, 'utf8'));

  for (const folder of foldersToUpload) {
    const dirPath = path.join(__dirname, folder.path);
    if (!fs.existsSync(dirPath)) {
      console.log(`Directory not found: ${dirPath}`);
      continue;
    }

    const files = fs.readdirSync(dirPath).filter(f => f.match(/\.(jpg|jpeg|png|gif|webp|mp4|mov)$/i));
    const category = folder.category;

    if (!data[category]) data[category] = [];

    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const isVideo = file.match(/\.(mp4|mov)$/i);

      if (data[category].some(v => v.name === file)) {
        console.log(`Skipping ${file}, already uploaded.`);
        continue;
      }

      console.log(`Uploading ${file}...`);
      try {
        let result;
        if (isVideo) {
          result = await cloudinary.uploader.upload_large(fullPath, {
            resource_type: "video",
            folder: `frames_by_ushani/${category}`,
            chunk_size: 6000000
          });
        } else {
          result = await cloudinary.uploader.upload(fullPath, {
            folder: `frames_by_ushani/${category}`
          });
        }

        data[category].push({
          name: file,
          url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height
        });
        console.log(`Uploaded successfully: ${result.secure_url}`);
      } catch (err) {
        console.error(`Failed to upload ${file}:`, err);
      }
    }
  }

  fs.writeFileSync(imagesDataPath, JSON.stringify(data, null, 2));
  console.log(`Successfully updated image data with new folders`);
}

uploadNewFolders();
