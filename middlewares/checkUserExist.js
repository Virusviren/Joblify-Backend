import Candidate from '../models/Candidate.js';
import Hr from '../models/Hr.js';
import createError from 'http-errors';

export const IsHR = async (req, res, next) => {
  try {
    let hr = await Hr.findOne({ email: req.body.email });
    if (!hr) {
      next();
    } else {
      res.send('User Exists as HR');
    }
  } catch (error) {
    next(err);
  }
};

export const IsUser = async (req, res, next) => {
  try {
    let user = await Candidate.findOne({ email: req.body.email });
    if (!user) {
      next();
    } else {
      res.send('User Exists');
    }
  } catch (error) {
    next(err);
  }
};
