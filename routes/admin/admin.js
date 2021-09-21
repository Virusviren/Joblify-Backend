import express from 'express';
import Hr from '../../models/Hr.js';
import Admin from '../../models/Admin.js';
import bcrypt from 'bcryptjs';
import { check, validationResult } from 'express-validator';
import { IsAdmin } from '../../middlewares/typeOfUser.js';
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
  IsAdmin,
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

//Admin login

router.post('/admin-login', IsAdmin, (req, res) => {});

// Add Admin

router.post(
  '/admin-registration',
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
    const { name, surname, email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let newAdmin = new Admin({
        email: email,
        password: password,
        name: name,
        surname: surname,
      });
      const salt = await bcrypt.genSalt(10);
      newAdmin.password = await bcrypt.hash(password, salt);
      await newAdmin.save();
      res.send('new Admin added');
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Server Error');
    }
  }
);

export default router;
