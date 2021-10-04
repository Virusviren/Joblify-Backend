import express from 'express';
import Job from '../../models/Job.js';

const router = express.Router();

router.get('/all-jobs', async (req, res) => {
  try {
    const jobs = await Job.find({}, { hrId: 0, candidates: 0 });
    console.log(jobs);
    res.status(200).send(jobs);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
