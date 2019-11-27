const passport = require('passport');
const UserRepository = require('../repositories/user');

exports.login = passport.authenticate('local', {
  successRedirect: '/rooms',
  failureRedirect: '/',
  failureFlash: true,
});

exports.register = async (req, res) => {
  const credentials = { username: req.body.username, password: req.body.password };

  if (credentials.username === '' || credentials.password === '') {
    req.flash('error', 'Missing credentials');
    req.flash('showRegisterForm', true);
    res.redirect('/');
  } else {
    const user = await UserRepository.findOne({ username: new RegExp(`^${req.body.username}$`, 'i') });
    if (user) {
      req.flash('error', 'Username already exists.');
      req.flash('showRegisterForm', true);
      res.redirect('/');
    } else {
      await UserRepository.create(credentials);
      req.flash('success', 'Your account has been created. Please log in.');
      res.redirect('/');
    }
  }
};

exports.logout = (req, res) => {
  req.logout();
  req.session = null;
  res.redirect('/');
};
