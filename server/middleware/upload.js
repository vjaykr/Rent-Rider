const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDir = path.join(__dirname, '../uploads');
const vehicleDir = path.join(uploadDir, 'vehicles');
const documentsDir = path.join(uploadDir, 'documents');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(vehicleDir)) {
  fs.mkdirSync(vehicleDir, { recursive: true });
}

if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'images') {
      cb(null, vehicleDir);
    } else if (file.fieldname.startsWith('documents[')) {
      cb(null, documentsDir);
    } else {
      cb(null, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fieldName = file.fieldname.includes('[') ? file.fieldname.split('[')[1].split(']')[0] : file.fieldname;
    cb(null, fieldName + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images for vehicle photos
  if (file.fieldname === 'images' && file.mimetype.startsWith('image/')) {
    cb(null, true);
  }
  // Accept images and PDFs for documents
  else if (file.fieldname.startsWith('documents[') && 
           (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Images allowed for photos, images/PDFs for documents.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = {
  uploadVehicleImages: upload.array('images', 5), // Allow up to 5 images
  uploadVehicleFiles: upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'documents[registration]', maxCount: 1 },
    { name: 'documents[insurance]', maxCount: 1 },
    { name: 'documents[permit]', maxCount: 1 },
    { name: 'documents[puc]', maxCount: 1 }
  ]),
  uploadSingle: upload.single('image')
};