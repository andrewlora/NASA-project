const fs = require('fs');
const https = require('https');
require('dotenv').config();
const app = require('./app');
const { mongoConnect } = require('./services/mongo');
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model');
const server = https.createServer(
  {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
  },
  app,
);

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
