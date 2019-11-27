const express = require('express');
const controller = require('../controllers/auth');

const router = express.Router();


// Login
router.post('/login', controller.login);

// Register via username and password
router.post('/register', controller.register);

// Logout
router.get('/logout', controller.logout);

module.exports = router;
