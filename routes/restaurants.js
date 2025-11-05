const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const { category, minRating, maxDeliveryFee, maxTime } = req.query;

    let filter = {};

    // Apply filters if provided
    if (category && category !== 'Tout') {
      filter.category = category;
    }

    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    if (maxDeliveryFee) {
      filter.deliveryFee = { $lte: parseFloat(maxDeliveryFee) };
    }

    if (maxTime) {
      filter.time = { $lte: parseInt(maxTime) };
    }

    const restaurants = await Restaurant.find(filter).sort({ rating: -1 });
    res.json({ restaurants });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des restaurants', error: error.message });
  }
});

// Get restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }

    res.json({ restaurant });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du restaurant', error: error.message });
  }
});

// Create new restaurant (admin only - for now accessible to all)
router.post('/', async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();

    res.status(201).json({
      message: 'Restaurant créé avec succès',
      restaurant,
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ message: 'Erreur lors de la création du restaurant', error: error.message });
  }
});

// Update restaurant
router.put('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }

    res.json({
      message: 'Restaurant mis à jour avec succès',
      restaurant,
    });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du restaurant', error: error.message });
  }
});

// Delete restaurant
router.delete('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }

    res.json({ message: 'Restaurant supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du restaurant', error: error.message });
  }
});

module.exports = router;
