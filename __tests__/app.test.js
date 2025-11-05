const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

describe('API Health Tests', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('GET / - should return 200', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  test('GET /unknown - should return 404', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
  });

  test('GET /api/health - should return health status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('uptime');
  });
});
