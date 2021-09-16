import express from 'express';

const router = express.Router();

// get looged in user
router.get('/user', (req, res) => {
  res.json({ Admin });
});

// Login the user and hr
router.post('/login', (req, res) => {
  res.send('user login credential');
});

// Registration for the user
router.post('/signup', (res, req) => {
  res.send('signUp');
});

// Sending the link of reset password on the mail of the user
router.post('/forgot-password/:email', (req, res) => {
  res.send('forgot password link to email');
});

// Reseting the password
router.patch('/forgot-password/reset/:email', (req, res) => {
  res.send('Link to edit password');
});

export default router;
