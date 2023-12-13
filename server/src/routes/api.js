const express = require('express');
const planetsRouter = require('./planets/planets.router');
const launchesRouter = require('./launches/launches.router');
const authRouter = require('./auth/auth.router');
const api = express.Router();
api.use('/planets', planetsRouter);
api.use('/launches', launchesRouter);
api.use('/auth', authRouter);
module.exports = api;
