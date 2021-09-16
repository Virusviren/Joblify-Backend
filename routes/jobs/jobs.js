import express from 'express';

const router = express.Router();

router.get('/all-jobs', (req, res) => {
  res.json({ Jobs });
});

export default router;
