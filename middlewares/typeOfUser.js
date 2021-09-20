import Candidate from '../models/Candidate.js';
import Hr from '../models/Hr.js';
export const WhichUser = async (req, res, next) => {
  try {
    let typeOfUser = null;
    let emailToVerify = await Hr.findOne({ email: req.body.email });
    if (emailToVerify && !null) {
      req.body.typeOfUser = 'Hr';
      console.log(req.body);
      next();
    } else {
      emailToVerify = await Candidate.findOne({ email: req.body.email });
    }
    if (emailToVerify && !null) {
      req.body.typeOfUser = 'Candidate';
      console.log(req.body);
      next();
    } else {
      res.send('Incorrect Credential ');
    }
  } catch (error) {
    next(error);
  }
};
