const multer = require('multer');
const path = require('path');

// Storage configuration for tracks
const trackStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/tracks/');
  },
  filename: (req, file, cb) => {
    cb(null, `track_${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Storage configuration for cover art
const coverStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/covers/');
  },
  filename: (req, file, cb) => {
    cb(null, `cover_${Date.now()}${path.extname(file.originalname)}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('audio/') || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const uploadTrack = multer({
  storage: trackStorage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

const uploadCover = multer({
  storage: coverStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = { uploadTrack, uploadCover };
