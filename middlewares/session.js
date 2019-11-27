const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const db = require('../database');

const handler = () => {
  if (process.env.NODE_ENV === 'production') {
    return session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      unset: 'destroy',
      store: new MongoStore({ mongooseConnection: db.Mongoose.connection }),
    });
  }
  return session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    unset: 'destroy',
    saveUninitialized: true,
  });
};

module.exports = handler();
