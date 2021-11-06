import express from 'express';
import { check, validationResult } from 'express-validator';
import { authHr } from '../../middlewares/auth.js';
import Hr from '../../models/Hr.js';
import Job from '../../models/Job.js';
import Application from '../../models/Application.js';
import { imageUpload } from '../../middlewares/multerFileCheck.js';
import multer from 'multer';
import { BUCKET_NAME, s3 } from '../../aws-storage/awsconfig.js';
const router = express.Router();

// Get profile details (get personal info) (get)
router.get('/profile', authHr, async (req, res) => {
  let hrDetails = await Hr.findById(req.userInfo.id, { password: 0 });
  if (hrDetails) {
    res.send(hrDetails);
  } else {
    res.send(500).send('error');
  }
});

// Edit text fields (personal info) (patch)
router.patch('/profile/edit', authHr, async (req, res) => {
  try {
    const id = req.userInfo.id;
    const { name, surname, mobileNumber } = req.body;
    const updates = {
      personalInfo: {
        name: name,
        surname: surname,
        mobileNumber: mobileNumber,
      },
    };
    const updated = await Hr.findByIdAndUpdate(id, updates, {
      new: true,
    });
    res.send(updated);
  } catch (error) {
    console.log(error);
    res.sendStatus(500).send({ message: error.message });
  }
});

// Edit image (personal info) (patch)

router.patch('/profile-photo/edit', authHr, async (req, res) => {
  try {
    imageUpload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        console.log(err.message);
        res.status(413).send('PayLoad Too Large');
      } else {
        const { buffer, mimetype } = req.file;
        const fileType = mimetype.split('/').pop(); // if wants to specify the type of the file in the aws. insert as a string in the key

        const profilePicture = {
          Bucket: `${BUCKET_NAME}/Hr/profile_picture`,
          Key: `${req.userInfo.id}`,
          Body: buffer,
          ACL: 'public-read',
        };
        await s3.upload(profilePicture, async (error, data) => {
          if (error) {
            console.log(error);
          } else {
            const updated = await Hr.findByIdAndUpdate(
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
});

// Get all posted jobs (get)

router.get('/jobs', authHr, async (req, res) => {
  let jobsPosted = await Job.find({ hrId: req.userInfo.id });
  res.send(jobsPosted);
});

// Post a job (post)

router.post(
  '/job',
  authHr,
  [
    check('overview', 'Please put the overview').notEmpty(),
    check('requirements', 'Please add the requirements').notEmpty(),
    check('experience', 'Please add the experience').notEmpty(),
    check('seniorityLevel', 'Please add the seniorityLevel').notEmpty(),
    check(
      'type',
      'Please add the type of the job. Remote or offline'
    ).notEmpty(),
    check('salary', 'Please Enter the Salary').notEmpty(),
    check('title', 'Please Enter the Job Title').notEmpty(),
  ],
  async (req, res) => {
    const {
      overview,
      requirements,
      experience,
      seniorityLevel,
      type,
      salary,
      title,
    } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let newJob = new Job({
        jobTitle: title,
        overview: overview,
        requirements: requirements,
        experience: experience,
        seniorityLevel: seniorityLevel,
        type: type,
        salary: salary,
        hrId: req.userInfo.id,
        candidates: [],
      });
      await newJob.save(async (err, job) => {
        console.log(job.id);

        let updates = {
          $push: {
            jobsPosted: job.id,
          },
        };
        console.log(req.userInfo.id);

        await Hr.findByIdAndUpdate(req.userInfo.id, updates, {
          new: true,
        });
      });
      res.send('new Job Posted');
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// Edit job details (patch)

router.patch(
  '/job/:jobId',
  authHr,
  [
    check('overview', 'Please put the overview').notEmpty(),
    check('requirements', 'Please add the requirements').notEmpty(),
    check('experience', 'Please add the experience').notEmpty(),
    check('seniorityLevel', 'Please add the seniorityLevel').notEmpty(),
    check(
      'type',
      'Please add the type of the job. Remote or offline'
    ).notEmpty(),
    check('salary', 'Please Enter the Salary').notEmpty(),
    check('title', 'Please Enter the Job Title').notEmpty(),
  ],
  async (req, res) => {
    const id = req.params.jobId;
    const {
      overview,
      requirements,
      experience,
      seniorityLevel,
      type,
      salary,
      title,
    } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      if (!(await Job.findById(id))) {
        res.send('No job Found');
      } else {
        let jobToEdit = await Job.findById(id);

        if (jobToEdit.hrId === req.userInfo.id) {
          const updates = {
            jobId: title,
            overview: overview,
            requirements: requirements,
            experience: experience,
            seniorityLevel: seniorityLevel,
            type: type,
            salary: salary,
            hrId: req.userInfo.id,
          };
          const updated = await Job.findByIdAndUpdate(
            req.params.jobId,
            updates,
            {
              new: true,
            }
          );
          res.send(updated);
        } else {
          res.send('You are not authorized to edit this job');
        }
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// Remove a job (delete)

router.delete('/job/:jobId', authHr, async (req, res) => {
  await Job.findByIdAndDelete(req.params.jobId);
  res.send('Deleted');
});

// Proceed to next round (patch)

router.patch('/stage/:applicationId', authHr, async (req, res) => {
  try {
    let { newStatus } = req.body;
    await Application.findByIdAndUpdate(req.params.applicationId, {
      $set: { status: newStatus },
    });
    res.status(200).send('Proceeded to next round');
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Reject application (patch)

router.patch('/reject/:applicationId', authHr, async (req, res) => {
  try {
    await Application.findByIdAndUpdate(req.params.applicationId, {
      $set: { status: 0 },
    });
    res.status(200).send('Application Rejected');
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Get all applications by JobId
router.get('/allApplications', authHr, async (req, res) => {
  console.log(req.userInfo);
  try {
    const allApplications = await Application.find({ hrId: req.userInfo.id });
    res.status(200).send(allApplications);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
