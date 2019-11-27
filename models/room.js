const Mongoose = require('mongoose');

const RoomSchema = new Mongoose.Schema({
  title: { type: String, required: true },
  connections: { type: [{ userId: String, socketId: String }] },
});

const roomModel = Mongoose.model('room', RoomSchema);

module.exports = roomModel;
