'use strict';
import express from 'express';
import multer from 'multer';
import { BUCKET_NAME, s3 } from '../../aws-storage/awsconfig.js';
import {
  coverLetterUpload,
  cvUpload,
  documentCandidate,
  imageUpload,
  videoUpload,
} from '../../middlewares/multerFileCheck.js';
import { authCandidate } from '../../middlewares/auth.js';
import Candidate from '../../models/Candidate.js';
import Application from '../../models/Application.js';
import Job from '../../models/Job.js';
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
    let { level, universityName, startingDate, endingDate } = req.body;
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
    console.log(error);
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
    try {
      let docId = req.userInfo.id;
      let itemId = req.params.educationItemId;
      console.log({ docId, itemId });
      const updates = { $pull: { education: { _id: itemId } } };
      await Candidate.findByIdAndUpdate(docId, updates, {
        new: true,
      });
      res.status(202).send('Deleted');
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal Server Error');
    }
  }
);

// Add work Experience
router.post('/profile/edit-workExperience', authCandidate, async (req, res) => {
  try {
    let { companyName, position, startingDate, description, endingDate } =
      req.body;
    let docId = req.userInfo.id;
    let updates = {
      $push: {
        workExperience: {
          companyName: companyName,
          description: description,
          position: position,
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

// Edit particular work experience item

router.patch(
  '/profile/edit-workExperience/:workExperienceItemId',
  authCandidate,
  async (req, res) => {
    try {
      let { companyName, position, startingDate, description, endingDate } =
        req.body;
      let docId = req.userInfo.id;
      let itemId = req.params.workExperienceItemId;
      console.log(itemId);
      const updates = {
        $set: {
          'workExperience.$.companyName': companyName,
          'workExperience.$.position': position,
          'workExperience.$.description': description,
          'workExperience.$.startingDate': startingDate,
          'workExperience.$.endingDate': endingDate,
        },
      };
      const updated = await Candidate.findOneAndUpdate(
        { _id: docId, workExperience: { $elemMatch: { _id: itemId } } },
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

// Remove the particular work experience
router.delete(
  '/profile/edit-workExperience/:workExperienceItemId',
  authCandidate,
  async (req, res) => {
    try {
      let docId = req.userInfo.id;
      let itemId = req.params.workExperienceItemId;
      console.log({ docId, itemId });
      const updates = { $pull: { workExperience: { _id: itemId } } };
      await Candidate.findByIdAndUpdate(docId, updates, {
        new: true,
      });
      res.status(202).send('Deleted');
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal Server Error');
    }
  }
);

// Edit Skills
router.patch('/profile/edit-skills', authCandidate, async (req, res) => {
  try {
    let skills = req.body.skills;
    console.log(skills);
    let docId = req.userInfo.id;
    const firstUpdate = {
      $set: {
        skills: [],
      },
    };
    await Candidate.findByIdAndUpdate(docId, firstUpdate, {
      new: true,
    });

    const updates = {
      $push: {
        skills: skills,
      },
    };
    const updated = await Candidate.findByIdAndUpdate(docId, updates, {
      new: true,
    });
    res.status(202).send(updated);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Edit video files
router.patch('/profile/edit/video', authCandidate, async (req, res) => {
  try {
    videoUpload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        console.log(err.message);
        res.status(413).send('PayLoad Too Large');
      } else {
        const { buffer } = req.file;
        const profileVideo = {
          Bucket: `${BUCKET_NAME}/Candidate/profile_video`,
          Key: `${req.userInfo.id}`,
          Body: buffer,
          ACL: 'public-read',
        };
        await s3.upload(profileVideo, async (error, data) => {
          if (error) {
            console.log(error);
          } else {
            const updated = await Candidate.findByIdAndUpdate(
              req.userInfo.id,
              {
                infoVideo: data.Location,
              },
              { new: true }
            );
            res.status(202).send(updated);
          }
        });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Edit CV (patch)
router.patch('/profile/edit/cv', authCandidate, (req, res) => {
  cvUpload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.log(err.message);
      res.status(413).send('PayLoad Too Large');
    } else {
      const { buffer } = req.file;
      const cv = {
        Bucket: `${BUCKET_NAME}/Candidate/cvs`,
        Key: `${req.userInfo.id}.pdf`,
        Body: buffer,
        ACL: 'public-read',
      };
      await s3.upload(cv, async (error, data) => {
        if (error) {
          console.log(error);
        } else {
          const updated = await Candidate.findByIdAndUpdate(
            req.userInfo.id,
            { cv: data.Location },
            { new: true }
          );
          res.status(202).send(updated);
        }
      });
    }
  });
});

// Edit CoverLetter (patch)
router.patch('/profile/edit/coverLetter', authCandidate, async (req, res) => {
  coverLetterUpload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.log(err.message);
      res.status(413).send('PayLoad Too Large');
    } else {
      const { buffer } = req.file;
      const coverLetter = {
        Bucket: `${BUCKET_NAME}/Candidate/coverLetters`,
        Key: `${req.userInfo.id}.pdf`,
        Body: buffer,
        ACL: 'public-read',
      };
      await s3.upload(coverLetter, async (error, data) => {
        if (error) {
          console.log(error);
        } else {
          const updated = await Candidate.findByIdAndUpdate(
            req.userInfo.id,
            { coverLetter: data.Location },
            { new: true }
          );
          res.status(202).send(updated);
        }
      });
    }
  });
});

// Edit image (patch)

router.patch(
  '/profile/edit/profile-photo',
  authCandidate,

  async (req, res) => {
    try {
      imageUpload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          console.log(err.message);
          res.status(413).send('PayLoad Too Large');
        } else {
          const { buffer, mimetype } = req.file;
          const fileType = mimetype.split('/').pop(); // if wants to specify the type of the file in the aws. insert as a string in the key

          const profilePicture = {
            Bucket: `${BUCKET_NAME}/Candidate/profile_picture`,
            Key: `${req.userInfo.id}`,
            Body: buffer,
            ACL: 'public-read',
          };
          await s3.upload(profilePicture, async (error, data) => {
            if (error) {
              console.log(error);
            } else {
              const updated = await Candidate.findByIdAndUpdate(
                req.userInfo.id,
                {
                  profilePhoto: data.Location,
                },
                { new: true }
              );
              res.status(202).send(updated);
            }
          });
        }
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal Server Error');
    }
  }
);

// Submit application (post)
router.post('/submit/:jobId', authCandidate, async (req, res) => {
  try {
    let videoUrl = '';
    let cvUrl = '';
    let coverLetterUrl = '';

    documentCandidate(req, res, async (err) => {
      // console.log(req.body.data);
      let newData = req.body.data;
      let data = JSON.parse(newData);
      console.log(data);
      try {
        if (err instanceof multer.MulterError) {
          console.log(err.message);
          res.status(413).send('PayLoad Too Large');
        } else {
          let videoBuffer = req.files.video[0].buffer;
          let cvBuffer = req.files.cv[0].buffer;

          let coverLetterBuffer = Buffer.from(req.files.coverLetter[0].buffer);

          const asyncS3Upload = (S3Config) =>
            new Promise((res, rej) =>
              s3.upload(S3Config, (error, data) => {
                if (error) rej(err);
                else res(data.Location);
              })
            );
          //Upload CoverLetter to AWS S3

          const coverLetter = {
            Bucket: `${BUCKET_NAME}/Applications/coverLetters`,
            Key: `${req.userInfo.id}.pdf`,
            Body: coverLetterBuffer,
            ACL: 'public-read',
          };

          coverLetterUrl = await asyncS3Upload(coverLetter);

          //Upload Video to AWS S3
          let videoBinary = Buffer.from(videoBuffer, 'binary');
          const video = {
            Bucket: `${BUCKET_NAME}/Applications/videos`,
            Key: `${req.userInfo.id}`,
            Body: videoBinary,
            ACL: 'public-read',
          };

          videoUrl = await asyncS3Upload(video);

          //Upload Cv to AWS S3
          const cv = {
            Bucket: `${BUCKET_NAME}/Applications/cvs`,
            Key: `${req.userInfo.id}.pdf`,
            Body: cvBuffer,
            ACL: 'public-read',
          };

          cvUrl = await asyncS3Upload(cv);
        }
      } catch (error) {
        console.log(error);
      }

      // Mongodb query
      try {
        //   console.log(data);
        let getEducationArray = (data) => {
          return data.education.map((educationItem) => educationItem);
        };
        let getWorkExperienceArray = (data) => {
          return data.workExperience.map(
            (workExperienceItem) => workExperienceItem
          );
        };
        // console.log(data.education);

        let newApplication = new Application({
          candidateId: req.userInfo.id,
          jobId: req.params.jobId,
          personalInfo: {
            name: data.personalInfo.name,
            surname: data.personalInfo.surname,
            dateOfBirth: data.personalInfo.dateOfBirth,
            citizenship: data.personalInfo.citizenship,
            address: data.personalInfo.address,
            mobileNumber: data.personalInfo.mobileNumber,
          },
          education: getEducationArray(data),

          workExperience: getWorkExperienceArray(data),
          skills: data.skills,
          email: data.email,
          cv: cvUrl,
          coverLetter: coverLetterUrl,
          infoVideo: videoUrl,
        });
        await newApplication.save(async (err, application) => {
          let updates = {
            $push: {
              appliedJobs: {
                applicationId: application.id,
                jobId: req.params.jobId,
              },
            },
          };

          const updated = await Candidate.findByIdAndUpdate(
            req.userInfo.id,
            updates,
            {
              new: true,
            }
          );
        });
        await Job.findByIdAndUpdate(req.params.jobId, {
          $push: { candidates: req.userInfo.id },
        });

        res.status(200).send('Application Submitted');
      } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Withdraw application (patch)
router.patch('/withdraw/:applicationId', authCandidate, async (req, res) => {
  try {
    await Application.findByIdAndUpdate(req.params.applicationId, {
      $set: { status: 5 },
    });
    res.status(200).send('Appliction withdrawn');
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
});

//Get all applications (get)

router.get('/applications', authCandidate, (req, res) => {
  res.send('Get the list of the job where the candidate applied');
});

export default router;
