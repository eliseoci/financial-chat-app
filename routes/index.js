const express = require('express');
const authRoutes = require('./auth');
const roomRoutes = require('./room');

const router = express.Router();

router.get('/', (req, res) => {
  // If user is already logged in, then redirect to rooms page
  if (req.isAuthenticated()) {
    res.redirect('/rooms');
  } else {
    res.render('login', {
      success: req.flash('success')[0],
      errors: req.flash('error'),
      showRegisterForm: req.flash('showRegisterForm')[0],
    });
  }
});

router.use(authRoutes);
router.use('/rooms', roomRoutes);

router.all('*', (req, res) => {
  res.status(404).sendFile(`${process.cwd()}/views/404.htm`);
});

module.exports = router;
