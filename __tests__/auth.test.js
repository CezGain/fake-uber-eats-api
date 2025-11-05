const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

describe('Auth API Tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '0612345678',
        password: 'password123',
        marketing: true,
      };

      const response = await request(app).post('/api/auth/register').send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Utilisateur créé avec succès');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', 'john@example.com');
      expect(response.body.user).not.toHaveProperty('password');
    });

    test('should not register user with existing email', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      await request(app).post('/api/auth/register').send(userData);

      const response = await request(app).post('/api/auth/register').send(userData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('existe déjà');
    });

    test('should handle registration errors', async () => {
      const response = await request(app).post('/api/auth/register').send({ email: 'invalid' });

      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: 'password123',
      });
    });

    test('should login successfully with correct credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'jane@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Connexion réussie');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', 'jane@example.com');
    });

    test('should not login with incorrect password', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'jane@example.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('incorrect');
    });

    test('should not login with non-existent email', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'notfound@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('incorrect');
    });
  });

  describe('GET /api/auth/me', () => {
    let token;

    beforeEach(async () => {
      const response = await request(app).post('/api/auth/register').send({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
      });
      token = response.body.token;
    });

    test('should get current user with valid token', async () => {
      const response = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.user).not.toHaveProperty('password');
    });

    test('should return 401 without token', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Token manquant');
    });

    test('should return 401 with invalid token', async () => {
      const response = await request(app).get('/api/auth/me').set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Token invalide');
    });

    test('should return 404 for deleted user', async () => {
      await User.deleteMany({});

      const response = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('non trouvé');
    });
  });
});
