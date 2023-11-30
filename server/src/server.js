const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');
const server = http.createServer(app);
dotenv.config();
/* mongoose.connection.on('open', () => {
  console.log('MongoDB connection ready !!!');
});
mongoose.connection.on('error', (error) => {
  console.error(error);
}); */

// database connection
mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB database is connected');
  } catch (error) {
    console.log('MongoDB database is connected failed ', error);
  }
};

const PORT = process.env.PORT || 8000;
function startServer() {
  // await mongoose.connect(process.env.MONGO_URL);

  server.listen(PORT, async () => {
    await connectDB();
    await loadPlanetsData();
    console.log('listening on port ' + PORT);
  });
}
startServer();
