import express from 'express';

const router = express.Router();

// Get profile details (get personal info) (get)

router.get('/profile/:candidateId', (req, res) => {
  res.send('Get all the information of the candidate and its details');
});

//Get all applications (get)

router.get('/applications/:candidateId', (req, res) => {
  res.send('Get the list of the job where the candidate applied');
});

// Edit text fields (patch)

router.patch('/profile/edit/:candidateId', (req, res) => {
  res.send('Edit the details of the candidate');
});

// Edit image (patch)

router.patch('/profile/edit/profile-photo/:candidateId', (req, res) => {
  res.send('Edit the url of the candidate photo by cloudinary');
});

// Edit files (patch)
router.patch('/profile/edit/files/:candidateId/:filetype', (req, res) => {
  res.send(
    'edit the file of the candidate depending on the filetype (CV/CoverLetter) '
  );
});

// Submit application (post)
router.post('/submit/:candidateId', (req, res) => {
  res.send('Application submit by the candidate');
});

// Withdraw application (patch)
router.patch('/withdraw/:applicationId', (req, res) => {
  res.send('Withdraw the application');
});

export default router;
