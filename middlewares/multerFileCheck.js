import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
export const documentCandidate = upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'coverLetter', maxCount: 1 },
]);
const imgUpload = multer({ storage: storage, limits: { fileSize: 4242880 } });
export const imageUpload = imgUpload.single('image');
