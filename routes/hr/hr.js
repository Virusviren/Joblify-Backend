import express from 'express';
import { check, validationResult } from 'express-validator';
import { authHr } from '../../middlewares/auth.js';
import Hr from '../../models/Hr.js';
import Job from '../../models/Job.js';
const router = express.Router();

// Get profile details (get personal info) (get)
router.get('/profile', authHr, async (req, res) => {
  let hrDetails = await Hr.findById(req.userInfo.id, { password: 0 });
  if (hrDetails) {
    res.send(hrDetails);
  } else {
    res.send('No user found');
  }
});

// Edit text fields (personal info) (patch)
router.patch('/profile/edit', authHr, async (req, res) => {
  try {
    const id = req.userInfo.id;
    const { name, surname } = req.body;
    const updates = {
      personalInfo: {
        name: name,
        surname: surname,
      },
    };
    const updated = await Hr.findByIdAndUpdate(id, updates, {
      new: true,
    });
    res.send(updated);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// Edit image (personal info) (patch)

router.patch('/profile-photo/edit', authHr, async (req, res) => {
  res.send('Edit the image url of the HR from cloudinary');
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
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let newJob = new Job({
        jobId: title,
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

router.patch('/stage/:applicationId', authHr, (req, res) => {
  res.send('Send the candidate to the next round');
});

export default router;
