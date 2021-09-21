import Candidate from '../models/Candidate.js';
import Hr from '../models/Hr.js';
import Admin from '../models/Admin.js';
export const WhichUser = async (req, res, next) => {
  try {
    let emailToVerify = await Hr.findOne({ email: req.body.email });

    if (emailToVerify) {
      req.body.typeOfUser = 'Hr';
      next();
    } else {
      emailToVerify = await Candidate.findOne({ email: req.body.email });
      if (emailToVerify && !null) {
        req.body.typeOfUser = 'Candidate';
        next();
      } else {
        res.send('Incorrect Credential ');
      }
    }
  } catch (error) {
    next(error);
  }
};

export const IsAdmin = async (req, res, next) => {
  try {
    let emailToVerify = await Admin.findOne({ email: req.body.email });
    if (emailToVerify) {
      req.body.typeOfUser = 'Admin';
      next();
    } else {
      res.send('Incorrect Credential');
    }
  } catch (error) {
    next(error);
  }
};
