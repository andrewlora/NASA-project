const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
require('dotenv').config();
const { Strategy } = require('passport-google-oauth20');
const cookieSession = require('cookie-session');
const api = require('./routes/api');
const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  COOKIE_KEY_1: process.env.COOKIE_KEY_1,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};
const AUTH_OPTIONS = {
  callbackURL: '/auth/google/callback',
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
};
function verifyCallBack(accessToken, refreshToken, profile, done) {
  console.log('Google profile', profile);
  done(null, profile);
}
passport.use(new Strategy(AUTH_OPTIONS, verifyCallBack));
// Save the session to the cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});
// Read the session from the cookie
passport.deserializeUser((id, done) => {
  // User.findById(id).then(user => {
  //  done(null, user);
  // });
  done(null, id);
});
const app = express();
app.use(helmet());
app.use(
  cookieSession({
    name: 'session',
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
  }),
);
app.use((req, res, next) => {
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = (cb) => {
      cb();
    };
  }
  if (req.session && req.session.save) {
    req.session.save = (cb) => {
      cb();
    };
  }
  next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: 'https://localhost:3000',
  }),
);
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/v1', api);
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});
module.exports = app;
