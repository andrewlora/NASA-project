const http = require('http');
const dotenv = require('dotenv');
const app = require('./app');
const { mongoConnect } = require('./services/mongo');
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model');
const server = http.createServer(app);
dotenv.config();

const PORT = process.env.PORT || 8000;
async function startServer() {
  // await mongoose.connect(process.env.MONGO_URL);
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();
  server.listen(PORT, () => {
    console.log('listening on port ' + PORT);
  });
}
startServer();
