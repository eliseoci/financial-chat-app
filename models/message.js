const Mongoose = require('mongoose');

const MessageSchema = new Mongoose.Schema({
  content: { type: String, required: true },
  username: { type: String, required: true },
  roomId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const messageModel = Mongoose.model('message', MessageSchema);

module.exports = messageModel;
