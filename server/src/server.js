const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');
const server = http.createServer(app);
mongoose.connection.on('open', () => {
  console.log('MongoDB connection ready !!!');
});
mongoose.connection.on('error', (error) => {
  console.error(error);
});
const PORT = process.env.PORT || 8000;
const MONGO_URL =
  'mongodb+srv://nodedev123:NSNrpIZLeEU2BATc@cluster0.kat0cop.mongodb.net/?retryWrites=true&w=majority';
async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log('listening on port ' + PORT);
  });
}
startServer();
