const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

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

async function processNewFolders() {
  let data = JSON.parse(fs.readFileSync(imagesDataPath, 'utf8'));

  for (const folder of foldersToUpload) {
    const dirPath = path.join(__dirname, folder.path);
    if (!fs.existsSync(dirPath)) continue;

    const files = fs.readdirSync(dirPath).filter(f => f.match(/\.(jpg|jpeg|png|gif|webp|mp4|mov)$/i));
    const category = folder.category;

    if (!data[category]) data[category] = [];

    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const isVideo = file.match(/\.(mp4|mov)$/i);
      
      // Check if this file was already processed and added to data
      if (data[category].some(v => v.name === file && v.url)) {
        console.log(`Skipping ${file}, already uploaded.`);
        continue;
      }

      console.log(`\nProcessing ${file}...`);
      let uploadPath = fullPath;
      let shouldCleanup = false;

      try {
        if (isVideo) {
          uploadPath = fullPath + '_comp.mp4';
          shouldCleanup = true;
          console.log('Compressing video...');
          await new Promise((resolve, reject) => {
            ffmpeg(fullPath)
              .videoCodec('libx264')
              .audioCodec('aac')
              .size('720x?')
              .outputOptions(['-crf 28', '-preset ultrafast'])
              .on('end', resolve)
              .on('error', reject)
              .save(uploadPath);
          });
          
          console.log('Uploading compressed video...');
          const result = await cloudinary.uploader.upload(uploadPath, { 
            resource_type: "video", 
            folder: `frames_by_ushani/${category}` 
          });
          
          // Remove old failed entries if any
          data[category] = data[category].filter(v => v.name !== file);
          
          data[category].push({ 
            name: file, 
            url: result.secure_url, 
            public_id: result.public_id, 
            width: result.width, 
            height: result.height 
          });
          console.log(`Uploaded successfully: ${result.secure_url}`);
          
        } else {
          const stats = fs.statSync(fullPath);
          if (stats.size > 9 * 1024 * 1024) { // over 9MB
             uploadPath = fullPath + '_comp.jpg';
             shouldCleanup = true;
             console.log('Compressing image...');
             await sharp(fullPath)
               .resize({ width: 1920, withoutEnlargement: true })
               .jpeg({ quality: 80 })
               .toFile(uploadPath);
          }
          console.log('Uploading image...');
          const result = await cloudinary.uploader.upload(uploadPath, { 
            folder: `frames_by_ushani/${category}` 
          });
          
          // Remove old failed entries if any
          data[category] = data[category].filter(v => v.name !== file);

          data[category].push({ 
            name: file, 
            url: result.secure_url, 
            public_id: result.public_id, 
            width: result.width, 
            height: result.height 
          });
          console.log(`Uploaded successfully: ${result.secure_url}`);
        }
        
        fs.writeFileSync(imagesDataPath, JSON.stringify(data, null, 2));

      } catch (err) {
        console.error(`Failed to process ${file}:`, err);
      } finally {
        if (shouldCleanup && fs.existsSync(uploadPath)) {
          fs.unlinkSync(uploadPath);
        }
      }
    }
  }
  
  console.log('Done processing all folders.');
}

processNewFolders();
