const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

cloudinary.config({ 
  cloud_name: 'dhfyfbxiv', 
  api_key: '758619196555259', 
  api_secret: 'yoacZsqiIxSY0C9HExUYY7AChmk' 
});

async function uploadBackground() {
  const fullPath = path.join(__dirname, 'images', 'Background', '01.mp4');
  if (!fs.existsSync(fullPath)) {
    console.error('Video not found!');
    return;
  }

  const uploadPath = fullPath + '_comp.mp4';
  
  try {
    console.log('Compressing background video for web playback...');
    await new Promise((resolve, reject) => {
      ffmpeg(fullPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .size('1280x?') // 720p for hero background
        .outputOptions(['-crf 28', '-preset ultrafast'])
        .on('end', resolve)
        .on('error', reject)
        .save(uploadPath);
    });
    
    console.log('Uploading compressed video...');
    const result = await cloudinary.uploader.upload(uploadPath, { 
      resource_type: "video", 
      folder: `frames_by_ushani/Background` 
    });
    
    console.log(`Uploaded successfully: ${result.secure_url}`);
    
    // Save to a text file for easy extraction
    fs.writeFileSync(path.join(__dirname, 'bg_url.txt'), result.secure_url);
    
  } catch (err) {
    console.error(`Failed to process:`, err);
  } finally {
    if (fs.existsSync(uploadPath)) {
      fs.unlinkSync(uploadPath);
    }
  }
}

uploadBackground();
