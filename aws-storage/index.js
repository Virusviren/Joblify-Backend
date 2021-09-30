import multer from 'multer';
import AWS from 'aws-sdk';
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });
export const cpUpload = upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'coverLetter', maxCount: 1 },
]);
const ID = process.env.AWS_ID;
const SECRET = process.env.AWS_SECRET;
export const BUCKET_NAME = process.env.BUCKETNAME;

export const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});

const imageUpload = upload.single();
