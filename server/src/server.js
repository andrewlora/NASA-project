const http = require('http');
const dotenv = require('dotenv');
const app = require('./app');
const { mongoConnect } = require('./services/mongo');
const { loadPlanetsData } = require('./models/planets.model');
const server = http.createServer(app);
dotenv.config();

const PORT = process.env.PORT || 8000;
function startServer() {
  // await mongoose.connect(process.env.MONGO_URL);
  server.listen(PORT, async () => {
    await mongoConnect();
    await loadPlanetsData();
    console.log('listening on port ' + PORT);
  });
}
startServer();
