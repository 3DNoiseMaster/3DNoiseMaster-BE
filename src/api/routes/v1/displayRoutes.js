// External module imports
const express = require('express');

const router = express.Router();

router.get('/main', (req, res) => {
  res.json({ message: 'Display main page' });
});

router.get('/login', (req, res) => {
  res.json({ message: 'Display login page' });
});

router.get('/signup', (req, res) => {
  res.json({ message: 'Display signup page' });
});

router.get('/workspace', (req, res) => {
  res.json({ message: 'Display workspace page' });
});

router.get('/workspace/newTask', (req, res) => {
  res.json({ message: 'Display new task page' });
});

router.get('/workspace/myResults', (req, res) => {
  res.json({ message: 'Display results page' });
});

// Module exports
module.exports = router;
