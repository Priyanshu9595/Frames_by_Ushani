const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({ 
  cloud_name: 'dhfyfbxiv', 
  api_key: '758619196555259', 
  api_secret: 'yoacZsqiIxSY0C9HExUYY7AChmk' 
});

async function uploadBackgroundRaw() {
  const fullPath = path.join(__dirname, 'images', 'Background', '01.mp4');
  if (!fs.existsSync(fullPath)) {
    console.error('Video not found!');
    return;
  }

  try {
    console.log('Uploading raw uncompressed video (91MB) to Cloudinary with callback...');
    
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_large(fullPath, { 
        resource_type: "video", 
        folder: `frames_by_ushani/Background_Raw`,
        chunk_size: 6000000
      }, function(error, result) {
        if (error) reject(error);
        else resolve(result);
      });
    });
    
    console.log(`Uploaded successfully: ${result.secure_url}`);
    fs.writeFileSync(path.join(__dirname, 'bg_raw_url.txt'), result.secure_url);
    
  } catch (err) {
    console.error(`Failed to process:`, err);
  }
}

uploadBackgroundRaw();
