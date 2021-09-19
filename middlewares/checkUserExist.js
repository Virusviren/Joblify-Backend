import Candidate from '../models/Candidate.js';
import Hr from '../models/Hr.js';

// To check if the signing up user is an already existing HR
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
// To check if the signing up user is an already existing Candidate
export const IsUser = async (req, res, next) => {
  try {
    let candidate = await Candidate.findOne({ email: req.body.email });
    if (!candidate) {
      next();
    } else {
      res.send('User Exists');
    }
  } catch (error) {
    next(err);
  }
};
