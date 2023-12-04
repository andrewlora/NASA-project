const axios = require('axios');
const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');
const launches = new Map();
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

const SPACE_X_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {
  console.log('Downloading launch data...');
  const response = await axios.post(SPACE_X_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc.payloads;
    const customers = payloads.flatMap((payload) => {
      return payload.customers;
    });
    const launch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customers,
    };
    console.log(`${launch.flightNumber} : ${launch.mission}`);
  }
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });
  if (firstLaunch) {
    console.log('Launch data already loaded');
  } else {
    await populateLaunches();
  }
}

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}

async function existsLaunchWithId(launchId) {
  // return launches.has(launchId);
  return await findLaunch({
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
  loadLaunchData,
};
