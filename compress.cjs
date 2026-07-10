const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({ 
  cloud_name: 'dhfyfbxiv', 
  api_key: '758619196555259', 
  api_secret: 'yoacZsqiIxSY0C9HExUYY7AChmk' 
});

const filesToCompress = [
  'images/wedding/wedding/02.JPG',
  'images/wedding/wedding/05(1).JPG',
  'images/wedding/wedding/Copy of SC_00230.JPG'
];

async function compressAndUpload() {
  const imagesDataPath = path.join(__dirname, 'src', 'data', 'images.json');
  let data = { wedding: [] };
  if (fs.existsSync(imagesDataPath)) {
    data = JSON.parse(fs.readFileSync(imagesDataPath, 'utf8'));
  }
  
  for (const relPath of filesToCompress) {
    const fullPath = path.join(__dirname, relPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`File not found: ${fullPath}`);
      continue;
    }
    
    console.log(`Compressing ${relPath}...`);
    const parsedPath = path.parse(fullPath);
    const compressedPath = path.join(parsedPath.dir, parsedPath.name + '_compressed' + parsedPath.ext);
    
    // Resize down if too large, compress JPEG
    await sharp(fullPath)
      .resize({ width: 4000, withoutEnlargement: true }) // Scale down to max 4000px width
      .jpeg({ quality: 80 }) // 80% quality
      .toFile(compressedPath);
      
    console.log(`Uploading ${compressedPath}...`);
    try {
      const result = await cloudinary.uploader.upload(compressedPath, {
        folder: `frames_by_ushani/wedding`
      });
      
      const fileName = path.basename(relPath);
      data.wedding.push({
        name: fileName,
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height
      });
      console.log(`Uploaded successfully: ${result.secure_url}`);
    } catch (e) {
      console.error(`Failed to upload ${compressedPath}:`, e);
    }
  }
  
  fs.writeFileSync(imagesDataPath, JSON.stringify(data, null, 2));
  console.log('Updated images.json');
}

compressAndUpload();
