exports.isMatch = (text, regex) => {
  if (regex.test(text)) {
    return true;
  }
  return false;
};

exports.CONSTANTS = require('./constants');
