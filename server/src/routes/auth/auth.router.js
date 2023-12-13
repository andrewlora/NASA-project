const express = require('express');
const passport = require('passport');
const {
  httpAuthGoogle,
  httpAuthGoogleCallback,
  httpLogout,
  httpSecret,
  httpFailure,
} = require('./auth.controller');
const authRouter = express.Router();

authRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email'],
  }),
  httpAuthGoogle,
);
authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/failure',
    successRedirect: '/',
    session: false,
  }),
  httpAuthGoogleCallback,
);
authRouter.get('/logout', httpLogout);
authRouter.get('/secret', httpSecret);
authRouter.get('/failure', httpFailure);

module.exports = authRouter;
