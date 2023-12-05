const mongoose = require('mongoose');
require('dotenv').config();
/* mongoose.connection.on('open', () => {
  console.log('MongoDB connection ready !!!');
});
mongoose.connection.on('error', (error) => {
  console.error(error);
}); */

// database connection

mongoose.set('strictQuery', false);
async function mongoConnect() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB database is connected');
  } catch (error) {
    console.error(error);
    console.log('MongoDB database is connected failed ', error);
  }
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
