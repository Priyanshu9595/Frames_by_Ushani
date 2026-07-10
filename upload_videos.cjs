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

function getAllVideos(dirPath) {
  let videos = [];
  if (!fs.existsSync(dirPath)) return videos;
  
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      videos = videos.concat(getAllVideos(fullPath));
    } else if (entry.name.match(/\.(mp4|mov|avi|webm|mkv)$/i)) {
      videos.push(fullPath);
    }
  }
  return videos;
}

async function uploadVideos() {
  let data = {};
  if (fs.existsSync(imagesDataPath)) {
    data = JSON.parse(fs.readFileSync(imagesDataPath, 'utf8'));
  }
  
  try {
    const categories = fs.readdirSync(imagesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
      
    for (const category of categories) {
      if (!data[category]) data[category] = [];
      const categoryPath = path.join(imagesDir, category);
      
      const files = getAllVideos(categoryPath);
        
      console.log(`Found ${files.length} videos in ${category}`);
      
      for (const filePath of files) {
        // Skip if already in data
        const fileName = path.basename(filePath);
        if (data[category].some(item => item.name === fileName)) {
           console.log(`Skipping ${fileName}, already uploaded.`);
           continue;
        }

        console.log(`Uploading video ${filePath}...`);
        
        try {
          const result = await cloudinary.uploader.upload(filePath, {
            folder: `frames_by_ushani/${category}`,
            resource_type: "video"
          });
          
          data[category].push({
            name: fileName,
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
    
    fs.writeFileSync(imagesDataPath, JSON.stringify(data, null, 2));
    console.log(`Successfully updated image data with videos`);
    
  } catch (error) {
    console.error("Error during upload process:", error);
  }
}

uploadVideos();
