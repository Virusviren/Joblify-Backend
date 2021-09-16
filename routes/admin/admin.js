import express from 'express';

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

router.post('/add-hr', (req, res) => {
  res.send('Add new hr');
});

// Edit hr details (patch)

router.patch('/edit-hr/:hrId', (req, res) => {
  res.send('Edit HR details');
});

// Remove hr (delete)

router.delete('/remove/:hrId', (req, res) => {
  res.send('Delete hr');
});

export default router;
