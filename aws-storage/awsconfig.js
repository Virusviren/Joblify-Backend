import AWS from 'aws-sdk';

const ID = process.env.AWS_ID;
const SECRET = process.env.AWS_SECRET;
export const BUCKET_NAME = process.env.BUCKETNAME;

export const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});
