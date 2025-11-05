const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  time: {
    type: Number,
    required: true,
    min: 0,
  },
  deliveryFee: {
    type: Number,
    required: true,
    min: 0,
  },
  promo: {
    type: String,
    trim: true,
  },
  color1: {
    type: String,
    required: true,
  },
  color2: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
