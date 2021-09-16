import express from 'express';

const router = express.Router();

// Get profile details (get personal info) (get)
router.get('/profile/:hrId', (req, res) => {
  res.send('Get the information of the hr');
});

// Edit text fields (personal info) (patch)
router.patch('/profile/edit/:hrId', (res, req) => {
  res.send('Edit the details of the HR');
});

// Edit image (personal info) (patch)

router.patch('/profile-photo/edit/:hrId', (req, res) => {
  res.send('Edit the image url of the HR from cloudinary');
});

// Get all posted jobs (get)

router.get('/jobs/:hrId', (req, res) => {
  res.send('Get all the jobs which are posted by the HR');
});

// Post a job (post)

router.post('/jobs/:hrId', (req, res) => {
  res.send('Post the job');
});

// Edit job details (patch)

router.patch('/jobs/:jobId', (req, res) => {
  res.send('Only the hr who posted the job can edit the job');
});

// Remove a job (delete)

router.delete('/jobs/:jobId', (req, res) => {
  res.send('Job deleted');
});

// Proceed to next round (patch)

router.patch('/stage/:applicationId', (req, res) => {
  res.send('Send the candidate to the next round');
});

export default router;
