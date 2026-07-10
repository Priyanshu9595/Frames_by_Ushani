const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: 'dhfyfbxiv', 
  api_key: '758619196555259', 
  api_secret: 'yoacZsqiIxSY0C9HExUYY7AChmk' 
});

const imagesDir = path.join(__dirname, 'images');
const dataDir = path.join(__dirname, 'src', 'data');
const outputFile = path.join(dataDir, 'images.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function getAllImages(dirPath) {
  let images = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      images = images.concat(getAllImages(fullPath));
    } else if (entry.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      images.push(fullPath);
    }
  }
  return images;
}

async function uploadImages() {
  const resultData = {};
  
  try {
    const categories = fs.readdirSync(imagesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
      
    for (const category of categories) {
      resultData[category] = [];
      const categoryPath = path.join(imagesDir, category);
      
      const files = getAllImages(categoryPath);
        
      console.log(`Found ${files.length} images in ${category}`);
      
      for (const filePath of files) {
        console.log(`Uploading ${filePath}...`);
        
        try {
          const result = await cloudinary.uploader.upload(filePath, {
            folder: `frames_by_ushani/${category}`
          });
          
          resultData[category].push({
            name: path.basename(filePath),
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height
          });
          console.log(`Uploaded successfully: ${result.secure_url}`);
        } catch (err) {
          console.error(`Failed to upload ${filePath}:`, err);
        }
      }
    }
    
    fs.writeFileSync(outputFile, JSON.stringify(resultData, null, 2));
    console.log(`Successfully wrote image data to ${outputFile}`);
    
  } catch (error) {
    console.error("Error during upload process:", error);
  }
}

uploadImages();
