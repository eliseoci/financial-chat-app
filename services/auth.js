const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserRepository = require('../models/user');

const MSG_WRONG_USER_OR_PASS = 'Incorrect username or password';
const init = () => {
  // Serialize and Deserialize user instances to and from the session.
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    UserRepository.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await UserRepository.findOne({ username: new RegExp(username, 'i') });
        if (!user) {
          return done(null, false, { message: MSG_WRONG_USER_OR_PASS });
        }
        const isMatch = await user.validatePassword(password);
        if (!isMatch) {
          return done(null, false, { message: MSG_WRONG_USER_OR_PASS });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ));

  return passport;
};

module.exports = init();
