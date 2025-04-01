const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisine: { type: String, required: true },
  location: {
    type: {
      type: String,
      default: "Point",
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  menuItems: [{
    name: String,
    price: Number,
    description: String
  }],
  imageUrl: {
    type: String,
    default: "https://images.pexels.com/photos/260767/pexels-photo-260767.jpeg"
  }
});

// Create 2dsphere index for geospatial queries
RestaurantSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Restaurant', RestaurantSchema);