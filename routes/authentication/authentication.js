import express from 'express';
import bcrypt from 'bcryptjs';
import { check, validationResult } from 'express-validator';
import { IsHR, IsUser } from '../../middlewares/checkUserExist.js';
import Candidate from '../../models/Candidate.js';
const router = express.Router();

// get looged in user
router.get('/user', (req, res) => {
  res.json({ Admin });
});

// Login the user and hr
router.post(
  '/login',
  [
    check('email', 'Please Enter the Email').isEmail(),
    check(
      'password',
      'Please enter the password more than 6 characters'
    ).isLength({ min: 6 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send('pass');
  }
);

// Registration for the user
router.post(
  '/signup',
  IsHR,
  IsUser,
  [
    check('name', 'Please enter your name').notEmpty(),
    check('surname', 'Please enter the surname').notEmpty(),
    check('email', 'Please Enter the Email').isEmail(),
    check(
      'password',
      'Please enter the password more than 6 characters'
    ).isLength({ min: 6 }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, surname, email, password } = req.body;

    let candidate = new Candidate({
      email: email,
      password: password,
      personalInfo: { name: name, surname: surname },
    });

    await candidate.save();
    res.send('Candidate Saved');
  }
);

// Sending the link of reset password on the mail of the user
router.post('/forgot-password/:email', (req, res) => {
  res.send('forgot password link to email');
});

// Reseting the password
router.patch('/forgot-password/reset/:email', (req, res) => {
  res.send('Link to edit password');
});

export default router;
