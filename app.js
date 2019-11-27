const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('connect-flash');

require('dotenv').config();

const session = require('./middlewares/session');
const passport = require('./services/auth');
const routes = require('./routes');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', routes);

module.exports = app;
