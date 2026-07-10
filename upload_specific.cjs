const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({ 
  cloud_name: 'dhfyfbxiv', 
  api_key: '758619196555259', 
  api_secret: 'yoacZsqiIxSY0C9HExUYY7AChmk' 
});

const imagesDataPath = path.join(__dirname, 'src', 'data', 'images.json');
let data = JSON.parse(fs.readFileSync(imagesDataPath, 'utf8'));

async function uploadSpecificImage() {
  const filePath = path.join(__dirname, 'images', 'wedding', 'wedding', '05(1)_compressed.JPG');
  const fileName = '05(1).JPG';

  // Check if it already exists in Wedding
  if (data.Wedding.some(v => v.name === fileName)) {
    console.log(`${fileName} is already in Wedding array.`);
    return;
  }

  console.log(`Uploading ${fileName}...`);
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'frames_by_ushani/Wedding'
    });

    data.Wedding.push({
      name: fileName,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height
    });
    
    fs.writeFileSync(imagesDataPath, JSON.stringify(data, null, 2));
    console.log(`Uploaded successfully: ${result.secure_url}`);
  } catch (err) {
    console.error(`Failed to upload ${fileName}:`, err);
  }
}

uploadSpecificImage();
