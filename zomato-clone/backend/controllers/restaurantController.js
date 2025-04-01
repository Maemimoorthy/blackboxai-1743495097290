const Restaurant = require('../models/Restaurant');

// Get all restaurants
exports.getRestaurants = async (req, res) => {
  try {
    const { cuisine, minRating, location, radius } = req.query;
    
    let query = {};
    
    // Filter by cuisine
    if (cuisine) {
      query.cuisine = cuisine;
    }
    
    // Filter by minimum rating
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }
    
    // Location-based search
    if (location && radius) {
      const [lng, lat] = location.split(',').map(Number);
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat]
          },
          $maxDistance: Number(radius) * 1000 // Convert km to meters
        }
      };
    }
    
    const restaurants = await Restaurant.find(query);
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single restaurant
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create restaurant (admin only)
exports.createRestaurant = async (req, res) => {
  try {
    const { name, cuisine, location, menuItems } = req.body;
    
    const restaurant = new Restaurant({
      name,
      cuisine,
      location: {
        type: 'Point',
        coordinates: location
      },
      menuItems
    });
    
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update restaurant (admin only)
exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete restaurant (admin only)
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};