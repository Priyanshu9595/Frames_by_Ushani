const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({ 
  cloud_name: 'dhfyfbxiv', 
  api_key: '758619196555259', 
  api_secret: 'yoacZsqiIxSY0C9HExUYY7AChmk' 
});

async function rotateAndUpload() {
  const imagesDataPath = path.join(__dirname, 'src', 'data', 'images.json');
  let data = JSON.parse(fs.readFileSync(imagesDataPath, 'utf8'));
  
  const originalPath = path.join(__dirname, 'images/wedding/wedding/05(1).JPG');
  const rotatedPath = path.join(__dirname, 'images/wedding/wedding/05(1)_rotated.JPG');
  
  console.log(`Rotating image...`);
  await sharp(originalPath)
    .rotate(90) // rotate clockwise 90 degrees
    .resize({ width: 4000, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toFile(rotatedPath);
    
  console.log(`Uploading rotated image...`);
  const result = await cloudinary.uploader.upload(rotatedPath, {
    folder: `frames_by_ushani/wedding`
  });
  
  // Find in data.wedding and replace
  const itemIndex = data.wedding.findIndex(img => img.name === '05(1).JPG');
  if (itemIndex > -1) {
    data.wedding[itemIndex].url = result.secure_url;
    data.wedding[itemIndex].public_id = result.public_id;
    data.wedding[itemIndex].width = result.width;
    data.wedding[itemIndex].height = result.height;
  } else {
    data.wedding.push({
      name: '05(1).JPG',
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height
    });
  }
  
  fs.writeFileSync(imagesDataPath, JSON.stringify(data, null, 2));
  console.log('Successfully updated images.json');
}

rotateAndUpload();
