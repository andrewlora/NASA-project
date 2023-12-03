const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');
describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
  }, 50000);
  afterAll(async () => {
    await mongoDisconnect();
  }, 50000);

  describe('Test GET /launches', () => {
    test('It should respond with 2000 success', async () => {
      const response = await request(app)
        .get('/launches')

        .expect('Content-Type', /json/)
        .expect(200);
      //expect(response.statusCode).toBe(200);
    });
  });

  describe('Test POST /launch', () => {
    const completeLaunchData = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-d',
      target: 'Kepler-62 f',
      launchDate: 'January 4, 2028',
    };
    const launchDataWithoutDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-d',
      target: 'Kepler-62 f',
    };
    const launchDataWithInvalidDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-d',
      target: 'Kepler-62 f',
      launchDate: 'zoo',
    };
    test('It should respond with 201 created', async () => {
      const response = await request(app)
        .post('/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201);
      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });
    test('It should catch missing required properties', async () => {
      const response = await request(app)
        .post('/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: 'Missing required launch property',
      });
    });
    test('It should catch invalid dates', async () => {
      const response = await request(app)
        .post('/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: 'Invalid launch date',
      });
    });
  });
});
