const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

cloudinary.config({ 
  cloud_name: 'dhfyfbxiv', 
  api_key: '758619196555259', 
  api_secret: 'yoacZsqiIxSY0C9HExUYY7AChmk' 
});

const foldersToFix = [
  { path: 'images/coorporate1', category: 'Corporate' },
  { path: 'images/Wedding1', category: 'Wedding' }
];

const imagesDataPath = path.join(__dirname, 'src', 'data', 'images.json');

async function fixImages() {
  let data = JSON.parse(fs.readFileSync(imagesDataPath, 'utf8'));

  for (const folder of foldersToFix) {
    const dirPath = path.join(__dirname, folder.path);
    if (!fs.existsSync(dirPath)) continue;

    const files = fs.readdirSync(dirPath).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
    const category = folder.category;

    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      
      console.log(`Fixing orientation and re-uploading ${file}...`);
      const uploadPath = fullPath + '_fixed.jpg';
      let shouldCleanup = true;

      try {
         // Auto-rotate based on EXIF, then resize to ensure it's under 10MB
         await sharp(fullPath)
           .rotate() // This is the magic fix! It reads EXIF and rotates the image correctly.
           .resize({ width: 1920, withoutEnlargement: true })
           .jpeg({ quality: 80 })
           .toFile(uploadPath);

         const result = await cloudinary.uploader.upload(uploadPath, { 
           folder: `frames_by_ushani/${category}` 
         });
         
         // Find and replace the old entry in data
         const index = data[category].findIndex(v => v.name === file);
         const newEntry = { 
           name: file, 
           url: result.secure_url, 
           public_id: result.public_id, 
           width: result.width, 
           height: result.height 
         };

         if (index !== -1) {
             data[category][index] = newEntry;
         } else {
             data[category].push(newEntry);
         }
         console.log(`Uploaded successfully: ${result.secure_url}`);

      } catch (err) {
        console.error(`Failed to process ${file}:`, err);
      } finally {
        if (shouldCleanup && fs.existsSync(uploadPath)) {
          fs.unlinkSync(uploadPath);
        }
      }
    }
  }
  
  fs.writeFileSync(imagesDataPath, JSON.stringify(data, null, 2));
  console.log('Done fixing and re-uploading all images.');
}

fixImages();
