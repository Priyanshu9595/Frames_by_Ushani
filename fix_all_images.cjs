const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({ 
  cloud_name: 'dhfyfbxiv', 
  api_key: '758619196555259', 
  api_secret: 'yoacZsqiIxSY0C9HExUYY7AChmk' 
});

const imagesDir = path.join(__dirname, 'images');
const imagesDataPath = path.join(__dirname, 'src', 'data', 'images.json');

function getAllImages(dirPath) {
  let images = [];
  if (!fs.existsSync(dirPath)) return images;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      images = images.concat(getAllImages(fullPath));
    } else if (entry.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      if (!entry.name.includes('_compressed') && !entry.name.includes('_rotated') && !entry.name.includes('_fixed')) {
        images.push(fullPath);
      }
    }
  }
  return images;
}

async function fixImages() {
  let data = JSON.parse(fs.readFileSync(imagesDataPath, 'utf8'));

  const categories = fs.readdirSync(imagesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
    
  for (const category of categories) {
    if (!data[category]) data[category] = [];
    const categoryPath = path.join(imagesDir, category);
    
    const files = getAllImages(categoryPath);
      
    console.log(`Processing ${files.length} images in ${category}`);
    
    for (const filePath of files) {
      const fileName = path.basename(filePath);
      
      console.log(`Fixing and uploading ${fileName}...`);
      const fixedPath = filePath + '_fixed.jpg';
      
      try {
        // Auto-orient based on EXIF (.rotate() without args), resize, and compress
        await sharp(filePath)
          .rotate() 
          .resize({ width: 3000, withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toFile(fixedPath);
          
        const result = await cloudinary.uploader.upload(fixedPath, {
          folder: `frames_by_ushani/${category}`
        });
        
        // Update data
        const existingIndex = data[category].findIndex(img => 
          img.name === fileName || 
          img.name === fileName.replace(/\.JPG$/i, '_compressed.JPG') ||
          img.name === fileName.replace(/\.JPG$/i, '_rotated.JPG')
        );
        
        if (existingIndex > -1) {
          data[category][existingIndex].url = result.secure_url;
          data[category][existingIndex].public_id = result.public_id;
          data[category][existingIndex].width = result.width;
          data[category][existingIndex].height = result.height;
          data[category][existingIndex].name = fileName; 
        } else {
          data[category].push({
            name: fileName,
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height
          });
        }
        
        console.log(`Uploaded successfully: ${result.secure_url}`);
        fs.unlinkSync(fixedPath);
      } catch (err) {
        console.error(`Failed to process ${fileName}:`, err);
      }
    }
  }
  
  fs.writeFileSync(imagesDataPath, JSON.stringify(data, null, 2));
  console.log(`Successfully updated all images.`);
}

fixImages();
