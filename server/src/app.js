const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
require('dotenv').config();
const { Strategy } = require('passport-google-oauth20');
const api = require('./routes/api');
const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
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
const app = express();
app.use(helmet());
app.use(passport.initialize());
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
