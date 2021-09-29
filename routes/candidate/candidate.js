import express from 'express';
import { BUCKET_NAME, cpUpload, s3 } from '../../aws-storage/index.js';
import { authCandidate } from '../../middlewares/auth.js';
import Candidate from '../../models/Candidate.js';

const router = express.Router();

// Get profile details (get personal info) (get)

router.get('/profile', authCandidate, async (req, res) => {
  let data = await Candidate.findById(req.userInfo.id, { password: 0 });
  res.send(data);
});

//Get all applications (get)

router.get('/applications', authCandidate, (req, res) => {
  res.send('Get the list of the job where the candidate applied');
});

// Edit text fields (patch)

router.patch('/profile/edit', authCandidate, (req, res) => {
  res.send('Edit the details of the candidate');
});

// Edit image (patch)

router.patch('/profile/edit/profile-photo/', authCandidate, (req, res) => {
  res.send('Edit the url of the candidate photo by cloudinary');
});

// Edit files (patch)
router.patch('/profile/edit/files/:filetype', authCandidate, (req, res) => {
  res.send(
    'edit the file of the candidate depending on the filetype (CV/CoverLetter) '
  );
});

// Submit application (post)
router.post('/submit/', authCandidate, (req, res) => {
  res.send('Application submit by the candidate');
});

// Withdraw application (patch)
router.patch('/withdraw/:applicationId', authCandidate, (req, res) => {
  res.send('Withdraw the application');
});

router.post('/aws-test', cpUpload, async (req, res) => {
  const { coverLetter, cv } = req.files;

  if (coverLetter && cv) {
    const coverLetterBuffer = coverLetter[0].buffer;
    const cvBuffer = cv[0].buffer;
    const coverLetterParams = {
      Bucket: `${BUCKET_NAME}/coverLetters`,
      Key: 'coverLetter.pdf',
      Body: coverLetterBuffer,
      ACL: 'public-read',
    };
    const cvParams = {
      Bucket: `${BUCKET_NAME}/cvs`,
      Key: 'cv.pdf',
      Body: cvBuffer,
      ACL: 'public-read',
    };

    await s3.upload(coverLetterParams, function (err, data) {
      if (err) {
        res.json({ error: true, Message: err });
      } else {
        console.log(`File uploaded successfully. ${data.Location}`);
      }
    });
    await s3.upload(cvParams, function (err, data) {
      if (err) {
        res.json({ error: true, Message: err });
      } else {
        console.log(`File uploaded successfully. ${data.Location}`);
      }
    });
  } else if (coverLetter) {
    const coverLetterBuffer = coverLetter[0].buffer;
    console.log('cover');
    console.log(coverLetterBuffer);
  } else if (cv) {
    const cvBuffer = cv[0].buffer;
    console.log('cv');
    console.log(cvBuffer);
  }
});

export default router;
