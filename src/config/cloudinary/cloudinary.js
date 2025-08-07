const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up storage engine for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'task-ninja-profiles', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // Allowed file formats
    transformation: [{ width: 500, height: 500, crop: 'limit' }], // Optional transformations
    public_id: (req,res)=> file.filename + '-' + Date.now()    
  }
});

module.exports = { cloudinary, storage };