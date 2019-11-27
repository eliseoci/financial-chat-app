const Mongoose = require('mongoose');
const userSchema = require('../models/user.js');
const roomSchema = require('../models/room.js');
const messageSchema = require('../models/message.js');

Mongoose.connect(process.env.MONGO_DB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

Mongoose.connection.on('error', (err) => {
  if (err) {
    throw err;
  }
});

module.exports = {
  Mongoose,
  models: {
    user: userSchema,
    room: roomSchema,
    message: messageSchema,
  },
};
