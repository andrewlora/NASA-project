const launches = new Map();
const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');
let latestFlightNumber = 100;
const DEFAULT_FLIGHT_NUMBER = 100;
const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Rocket IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customer: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

async function existsLaunchWithId(launchId) {
  // return launches.has(launchId);
  return await launchesDatabase.findOne({
    flightNumber: launchId,
  });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase.findOne({}).sort('-flightNumber');
  return !latestLaunch ? DEFAULT_FLIGHT_NUMBER : latestLaunch.flightNumber;
}

async function getAllLaunches() {
  // return Array.from(launches.values());
  const launches = await launchesDatabase.find(
    {},
    {
      _id: 0,
      __v: 0,
    },
  );
  return launches;
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error('No matching planet was found');
  }
  await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    },
  );
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const launchSave = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['ZTM', 'NASA'],
    flightNumber: newFlightNumber,
  });
  await saveLaunch(launchSave);
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  const launchSave = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['ZTM', 'NASA'],
    flightNumber: latestFlightNumber,
  });
  launches.set(latestFlightNumber, launchSave);
}

async function abortLaunchById(launchId) {
  // launch.delete(launchId);
  // const aborted = launches.get(launchId);
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    },
  );
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted.ok === 1 && aborted.nModified === 1;
  return aborted.modifiedCount === 1;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  addNewLaunch,
  scheduleNewLaunch,
  abortLaunchById,
};
