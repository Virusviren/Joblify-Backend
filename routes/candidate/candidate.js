import express from 'express';
import { BUCKET_NAME, cpUpload, s3 } from '../../aws-storage/index.js';
import { authCandidate } from '../../middlewares/auth.js';
import Candidate from '../../models/Candidate.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get profile details (get personal info) (get)

router.get('/profile', authCandidate, async (req, res) => {
  try {
    let data = await Candidate.findById(req.userInfo.id, { password: 0 });
    res.status(200).send(data);
  } catch (error) {
    res.status(404).send('Not Found');
  }
});

//Get all applications (get)

router.get('/applications', authCandidate, (req, res) => {
  res.send('Get the list of the job where the candidate applied');
});

// Edit personalInfo (patch)
router.patch(
  '/profile/edit-personalInformation',
  authCandidate,
  async (req, res) => {
    try {
      const { dateOfBirth, citizenship, address, mobileNumber, name, surname } =
        req.body;
      const id = req.userInfo.id;
      console.log(id);
      const updates = {
        personalInfo: {
          name: name,
          surname: surname,
          dateOfBirth: dateOfBirth,
          citizenship: citizenship,
          address: address,
          mobileNumber: mobileNumber,
        },
      };
      const updated = await Candidate.findByIdAndUpdate(id, updates, {
        new: true,
      });
      res.status(202).send(updated);
    } catch (error) {
      console.log(error.message);
      res.status(304).send('Not Modified');
    }
  }
);

//Add education (post)
router.post('/profile/edit-education', authCandidate, async (req, res) => {
  try {
    let { level, universityName, startingDate, id, endingDate } = req.body;
    let docId = req.userInfo.id;
    console.log(req.userInfo);
    let updates = {
      $push: {
        education: {
          level: level,
          universityName: universityName,
          startingDate: startingDate,
          endingDate: endingDate,
        },
      },
    };

    const updated = await Candidate.findByIdAndUpdate(docId, updates, {
      new: true,
    });
    console.log(updated);
    res.status(202).send(updated);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Edit particular education item
router.patch(
  '/profile/edit-education/:educationItemId',
  authCandidate,
  async (req, res) => {
    try {
      let { level, universityName, startingDate, endingDate } = req.body;
      let docId = req.userInfo.id;
      let itemId = req.params.educationItemId;
      console.log(itemId);
      const updates = {
        $set: {
          'education.$.level': level,
          'education.$.universityName': universityName,
          'education.$.startingDate': startingDate,
          'education.$.endingDate': endingDate,
        },
      };
      const updated = await Candidate.findOneAndUpdate(
        { _id: docId, education: { $elemMatch: { _id: itemId } } },
        updates,
        {
          new: true,
        }
      );
      res.status(202).send(updated);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal Server Error');
    }
  }
);

// Remove the particular education Item
router.delete(
  '/profile/edit-education/:educationItemId',
  authCandidate,
  async (req, res) => {
    let docId = req.userInfo.id;
    let itemId = req.params.educationItemId;
    console.log({ docId, itemId });
    const updates = { $pull: { education: { _id: itemId } } };
    await Candidate.findByIdAndUpdate(docId, updates, {
      new: true,
    });
    res.send('done');
  }
);

// Edit image (patch)

router.delete(
  '/profile/edit-education/:educationItemId',
  authCandidate,
  (req, res) => {
    res.send('Delete the education item');
  }
);

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
  //const { coverLetter, cv } = req.files;

  if (req.files !== undefined) {
    req.files.coverLetter !== undefined &&
      req.files.cv !== undefined &&
      console.log('there are files');
    console.log(req.body.name);
  } else {
    console.log('no files');
  }

  // if (req.files.coverLetter !== undefined || req.files.cv !== undefined) {
  //   console.log('there are files');
  // } else {
  //   console.log('there are no files');
  // }

  // if (coverLetter && cv) {
  //   const coverLetterBuffer = coverLetter[0].buffer;
  //   const cvBuffer = cv[0].buffer;
  //   const coverLetterParams = {
  //     Bucket: `${BUCKET_NAME}/coverLetters`,
  //     Key: 'coverLetter.pdf',
  //     Body: coverLetterBuffer,
  //     ACL: 'public-read',
  //   };
  //   const cvParams = {
  //     Bucket: `${BUCKET_NAME}/cvs`,
  //     Key: 'cv.pdf',
  //     Body: cvBuffer,
  //     ACL: 'public-read',
  //   };

  //   await s3.upload(coverLetterParams, function (err, data) {
  //     if (err) {
  //       res.json({ error: true, Message: err });
  //     } else {
  //       console.log(`File uploaded successfully. ${data.Location}`);
  //     }
  //   });
  //   await s3.upload(cvParams, function (err, data) {
  //     if (err) {
  //       res.json({ error: true, Message: err });
  //     } else {
  //       console.log(`File uploaded successfully. ${data.Location}`);
  //     }
  //   });
  // } else if (coverLetter) {
  //   const coverLetterBuffer = coverLetter[0].buffer;
  //   console.log('cover');
  //   console.log(coverLetterBuffer);
  // } else if (cv) {
  //   const cvBuffer = cv[0].buffer;
  //   console.log('cv');
  //   console.log(cvBuffer);
  // }
});

export default router;
