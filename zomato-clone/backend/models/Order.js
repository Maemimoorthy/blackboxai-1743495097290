const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  restaurant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant', 
    required: true 
  },
  items: [{
    name: String,
    price: Number,
    quantity: Number
  }],
  total: { 
    type: Number, 
    required: true 
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: {
    street: String,
    city: String,
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  estimatedDelivery: Date,
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Add compound index for frequently queried fields
OrderSchema.index({ user: 1, status: 1 });
OrderSchema.index({ restaurant: 1, status: 1 });

module.exports = mongoose.model('Order', OrderSchema);