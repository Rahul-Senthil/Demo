const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRECT
})

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: 'Rental',
        allowedFormat: ['jpeg', 'jpg', 'png']
    }
})

module.exports = {
    cloudinary,
    storage
}