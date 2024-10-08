import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

// カスタムエラータイプの定義
interface CustomError extends Error {
  code?: string;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(16, (err, raw) => {
      if (err) return cb(err, '');
      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
});

const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(file.mimetype)) {
    const error: CustomError = new Error('Incorrect file type');
    error.code = 'INCORRECT_FILETYPE';
    return cb(error);
  }
  cb(null, true);
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  }
});