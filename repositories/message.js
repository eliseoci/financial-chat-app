const Message = require('../database').models.message;

const create = (data) => {
  const newMessage = new Message(data);
  return newMessage.save();
};

const find = (data) => Message.find(data);

const findOne = (data) => Message.findOne(data);

const findById = (id) => Message.findById(id);

const getLastMessages = ({ limit = 50, roomId }) => {
  const res = find({ roomId }).sort({ createdAt: 1 }).limit(limit);
  return res;
};

module.exports = {
  create,
  find,
  findOne,
  findById,
  getLastMessages,
};
