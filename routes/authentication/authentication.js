import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import { IsHR, IsUser } from '../../middlewares/checkUserExist.js';
import Candidate from '../../models/Candidate.js';
import { WhichUser } from '../../middlewares/typeOfUser.js';
import Hr from '../../models/Hr.js';
const router = express.Router();

// get logged in user
router.get('/user', (req, res) => {
  res.json({ Admin });
});

// Login the user and hr
router.post(
  '/login',
  // middleware for checking the response body by express-validator
  WhichUser,
  [
    check('email', 'Please Enter the Email').isEmail(),
    check(
      'password',
      'Please enter the password more than 6 characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    let { email, password, typeOfUser } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Compare the password of the typeof user in the particular database
    try {
      if (typeOfUser === 'Candidate') {
        let user = await Candidate.findOne({ email: email });
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          const payload = {
            userInfo: {
              id: user.id,
              type: typeOfUser,
            },
          };
          jwt.sign(
            payload,
            process.env.JWTSECRET,
            {
              expiresIn: 36000,
            },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        } else {
          res.status(401).send('Password Incorrect');
        }
      } else if (typeOfUser === 'Hr') {
        let user = await Hr.findOne({ email: email });
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          const payload = {
            userInfo: {
              id: user.id,
              type: typeOfUser,
            },
          };
          jwt.sign(
            payload,
            process.env.JWTSECRET,
            {
              expiresIn: 36000,
            },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        } else {
          res.send('Password Incorrect');
        }
      } else {
        res.send('No User not found');
      }
    } catch (error) {
      console.log(error.message);

      res.status(500).send('Server Error');
    }
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
    try {
      // setting the new variable with the Candidate model to save in database
      let candidate = new Candidate({
        email: email,
        password: password,
        personalInfo: { name: name, surname: surname },
      });

      // Salting and hashing the password before saving it to database
      const salt = await bcrypt.genSalt(10);
      candidate.password = await bcrypt.hash(password, salt);
      const user = await candidate.save();

      // Creating and Sending the Jwt token for verification
      const payload = {
        userInfo: {
          id: user.id,
          type: 'Candidate',
        },
      };
      jwt.sign(
        payload,
        process.env.JWTSECRET,
        {
          expiresIn: 36000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// Sending the link of reset password on the mail of the user
router.post('/forgot-password/:email', (req, res) => {
  res.send('forgot password link to email');
});

// Resetting the password
router.patch('/forgot-password/reset/:email', (req, res) => {
  res.send('Link to edit password');
});

export default router;
