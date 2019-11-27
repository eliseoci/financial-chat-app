/* eslint-disable consistent-return */
const Mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const UserSchema = new Mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

UserSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(user.password, salt, null);
    user.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const userModel = Mongoose.model('user', UserSchema);

module.exports = userModel;
