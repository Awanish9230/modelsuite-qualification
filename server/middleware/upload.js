const multer = require('multer');
const path = require('path');

// Store files locally on disk
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // uploaded at the same millisecond will overwrite each other
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
// File filter to restrict file uploads to PDF and specific image formats (Issue #4)
// This prevents executable files and other unsupported formats from being uploaded
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  // We use strict MIME type validation rather than just file extensions
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Return an error for invalid file types
    cb(new Error('Invalid file type. Only PDF, JPEG, PNG, GIF, and WEBP are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter
});

module.exports = upload;
