const express = require('express');
const auth = require('../middlewares/auth');
const controller = require('../controllers/room');

const router = express.Router();

// Rooms
router.get('/', [auth.isAuthenticated, controller.getRooms]);

// Chat Room
router.get('/:id', [auth.isAuthenticated, controller.getRoom]);

module.exports = router;
