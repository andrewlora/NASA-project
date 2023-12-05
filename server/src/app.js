const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const morgan = require('morgan');
const api = require('./routes/api');
const app = express();
app.use(helmet());
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
