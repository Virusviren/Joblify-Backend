import express from 'express';
import Hr from '../../models/Hr.js';
import bcrypt from 'bcryptjs';
import { check, validationResult } from 'express-validator';
const router = express.Router();

// Get profile details (get personal info) (get)

router.get('/profile/:adminId', (req, res) => {
  res.send('Admin details');
});

// Get all hrs list (get)

router.get('/hr', (req, res) => {
  res.send('All Hr list');
});

// Add new hr (post)

router.post(
  '/add-hr',
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
    const { name, surname, email, password, position } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let newHr = new Hr({
        email: email,
        password: password,
        personalInfo: {
          name: name,
          surname: surname,
        },
        workDetails: {
          position: position,
        },
      });
      const salt = await bcrypt.genSalt(10);
      newHr.password = await bcrypt.hash(password, salt);
      await newHr.save();
      res.send('new hr added');
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// Edit hr details (patch)

router.patch('/edit-hr/:hrId', (req, res) => {
  res.send('Edit HR details');
});

// Remove hr (delete)

router.delete('/remove/:hrId', (req, res) => {
  res.send('Delete hr');
});

export default router;
