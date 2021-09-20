import express from 'express';
import { authCandidate } from '../../middlewares/auth.js';
import Candidate from '../../models/Candidate.js';

const router = express.Router();

// Get profile details (get personal info) (get)

router.get('/profile', authCandidate, async (req, res) => {
  let data = await Candidate.findById(req.userInfo.id);
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

export default router;
