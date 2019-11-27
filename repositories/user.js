const User = require('../database').models.user;

const create = (data) => {
  const newUser = new User(data);
  return newUser.save();
};

const findOne = (data) => User.findOne(data);

const findById = (id) => User.findById(id);

module.exports = {
  create,
  findOne,
  findById,
};
