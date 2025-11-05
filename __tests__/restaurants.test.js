const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Restaurant = require('../models/Restaurant');

describe('Restaurants API Tests', () => {
  const mockRestaurant = {
    name: 'Test Restaurant',
    category: 'Italien',
    rating: 4.5,
    deliveryFee: 2.99,
    time: 30,
    image: 'test.jpg',
    color1: '#FF0000',
    color2: '#00FF00',
    description: 'A test restaurant',
  };

  beforeEach(async () => {
    await Restaurant.deleteMany({});
  });

  afterAll(async () => {
    await Restaurant.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/restaurants', () => {
    beforeEach(async () => {
      await Restaurant.insertMany([
        { ...mockRestaurant, name: 'Restaurant 1', rating: 4.5 },
        { ...mockRestaurant, name: 'Restaurant 2', rating: 3.8, category: 'Japonais' },
        { ...mockRestaurant, name: 'Restaurant 3', rating: 4.9, deliveryFee: 1.99, time: 20 },
      ]);
    });

    test('should get all restaurants', async () => {
      const response = await request(app).get('/api/restaurants');

      expect(response.status).toBe(200);
      expect(response.body.restaurants).toHaveLength(3);
      expect(response.body.restaurants[0].rating).toBeGreaterThanOrEqual(response.body.restaurants[1].rating);
    });

    test('should filter by category', async () => {
      const response = await request(app).get('/api/restaurants').query({ category: 'Japonais' });

      expect(response.status).toBe(200);
      expect(response.body.restaurants).toHaveLength(1);
      expect(response.body.restaurants[0].category).toBe('Japonais');
    });

    test('should filter by minimum rating', async () => {
      const response = await request(app).get('/api/restaurants').query({ minRating: 4.0 });

      expect(response.status).toBe(200);
      expect(response.body.restaurants.length).toBeGreaterThanOrEqual(1);
      response.body.restaurants.forEach((restaurant) => {
        expect(restaurant.rating).toBeGreaterThanOrEqual(4.0);
      });
    });

    test('should filter by max delivery fee', async () => {
      const response = await request(app).get('/api/restaurants').query({ maxDeliveryFee: 2.5 });

      expect(response.status).toBe(200);
      expect(response.body.restaurants).toHaveLength(1);
      expect(response.body.restaurants[0].deliveryFee).toBeLessThanOrEqual(2.5);
    });

    test('should filter by max time', async () => {
      const response = await request(app).get('/api/restaurants').query({ maxTime: 25 });

      expect(response.status).toBe(200);
      expect(response.body.restaurants).toHaveLength(1);
      expect(response.body.restaurants[0].time).toBeLessThanOrEqual(25);
    });

    test('should handle multiple filters', async () => {
      const response = await request(app).get('/api/restaurants').query({ minRating: 4.0, maxDeliveryFee: 3.0 });

      expect(response.status).toBe(200);
      response.body.restaurants.forEach((restaurant) => {
        expect(restaurant.rating).toBeGreaterThanOrEqual(4.0);
        expect(restaurant.deliveryFee).toBeLessThanOrEqual(3.0);
      });
    });

    test('should ignore "Tout" category filter', async () => {
      const response = await request(app).get('/api/restaurants').query({ category: 'Tout' });

      expect(response.status).toBe(200);
      expect(response.body.restaurants).toHaveLength(3);
    });
  });

  describe('GET /api/restaurants/:id', () => {
    let restaurantId;

    beforeEach(async () => {
      const restaurant = await Restaurant.create(mockRestaurant);
      restaurantId = restaurant._id.toString();
    });

    test('should get restaurant by ID', async () => {
      const response = await request(app).get(`/api/restaurants/${restaurantId}`);

      expect(response.status).toBe(200);
      expect(response.body.restaurant).toHaveProperty('name', 'Test Restaurant');
      expect(response.body.restaurant).toHaveProperty('rating', 4.5);
    });

    test('should return 404 for non-existent restaurant', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/restaurants/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('non trouvé');
    });

    test('should handle invalid ID format', async () => {
      const response = await request(app).get('/api/restaurants/invalid-id');

      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/restaurants', () => {
    test('should create a new restaurant', async () => {
      const response = await request(app).post('/api/restaurants').send(mockRestaurant);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Restaurant créé avec succès');
      expect(response.body.restaurant).toHaveProperty('name', 'Test Restaurant');
    });

    test('should handle creation errors', async () => {
      const response = await request(app).post('/api/restaurants').send({ name: 'Incomplete' });

      expect(response.status).toBe(500);
    });
  });

  describe('PUT /api/restaurants/:id', () => {
    let restaurantId;

    beforeEach(async () => {
      const restaurant = await Restaurant.create(mockRestaurant);
      restaurantId = restaurant._id.toString();
    });

    test('should update a restaurant', async () => {
      const updates = { name: 'Updated Restaurant', rating: 5.0 };

      const response = await request(app).put(`/api/restaurants/${restaurantId}`).send(updates);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Restaurant mis à jour avec succès');
      expect(response.body.restaurant).toHaveProperty('name', 'Updated Restaurant');
      expect(response.body.restaurant).toHaveProperty('rating', 5.0);
    });

    test('should return 404 for non-existent restaurant', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).put(`/api/restaurants/${fakeId}`).send({ name: 'Test' });

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('non trouvé');
    });

    test('should handle invalid update data', async () => {
      const response = await request(app).put(`/api/restaurants/${restaurantId}`).send({ rating: 'invalid' });

      expect(response.status).toBe(500);
    });
  });

  describe('DELETE /api/restaurants/:id', () => {
    let restaurantId;

    beforeEach(async () => {
      const restaurant = await Restaurant.create(mockRestaurant);
      restaurantId = restaurant._id.toString();
    });

    test('should delete a restaurant', async () => {
      const response = await request(app).delete(`/api/restaurants/${restaurantId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Restaurant supprimé avec succès');

      const deletedRestaurant = await Restaurant.findById(restaurantId);
      expect(deletedRestaurant).toBeNull();
    });

    test('should return 404 for non-existent restaurant', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).delete(`/api/restaurants/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('non trouvé');
    });

    test('should handle deletion errors', async () => {
      const response = await request(app).delete('/api/restaurants/invalid-id');

      expect(response.status).toBe(500);
    });
  });
});
