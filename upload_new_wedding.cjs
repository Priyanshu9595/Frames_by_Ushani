const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'dhfyfbxiv', 
  api_key: '758619196555259', 
  api_secret: 'yoacZsqiIxSY0C9HExUYY7AChmk' 
});

const dataPath = path.join(__dirname, 'src', 'data', 'images.json');
let data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

async function processAndUpload() {
  const imagesDir = path.join(__dirname, 'images');
  const files = fs.readdirSync(imagesDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
  
  console.log(`Found ${files.length} images to process in root images folder.`);

  for (const file of files) {
    const inputPath = path.join(imagesDir, file);
    const compressedPath = path.join(imagesDir, `compressed_${file}`);
    
    // Check if already in JSON
    if (data.Wedding.some(item => item.name === file)) {
      console.log(`Skipping ${file}, already in Wedding array.`);
      continue;
    }

    try {
      console.log(`Compressing ${file}...`);
      await sharp(inputPath)
        .resize({ width: 1920, withoutEnlargement: true }) // Resize to max 1080p width
        .jpeg({ quality: 80 })
        .toFile(compressedPath);

      console.log(`Uploading ${file}...`);
      const result = await cloudinary.uploader.upload(compressedPath, {
        folder: 'frames_by_ushani/Wedding'
      });

      data.Wedding.push({
        name: file, // Keep original name in JSON for reference
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height
      });
      
      console.log(`Uploaded successfully: ${result.secure_url}`);
      
      // Clean up compressed file
      fs.unlinkSync(compressedPath);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  console.log('Finished uploading and updated images.json');
}

processAndUpload();
