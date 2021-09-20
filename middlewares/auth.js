import jwt from 'jsonwebtoken';

export const authHr = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    req.userInfo = decoded.userInfo;
    if (req.userInfo.type === 'Hr') {
      next();
    } else {
      res.status(401).json({ msg: 'Not a hr' });
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ msg: 'token is not valid' });
  }
};

export const authCandidate = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    req.userInfo = decoded.userInfo;
    if (req.userInfo.type === 'Candidate') {
      next();
    } else {
      res.status(401).json({ msg: 'Not a Candidate' });
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ msg: 'token is not valid' });
  }
};
