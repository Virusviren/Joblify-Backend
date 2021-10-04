import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 41943040 } });
export const documentCandidate = upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'coverLetter', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]);

const imgUpload = multer({ storage: storage, limits: { fileSize: 4242880 } });
export const imageUpload = imgUpload.single('image');

const vidUpload = multer({
  storage: storage,
  limits: { fileSize: 20971520 },
});
export const videoUpload = vidUpload.single('video');

const fileUpload = multer({ storage: storage, limits: { fileSize: 10485760 } });

export const cvUpload = fileUpload.single('cv');
export const coverLetterUpload = fileUpload.single('coverLetter');
