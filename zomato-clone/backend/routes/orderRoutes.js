const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { validateOrder } = require('../middlewares/validationMiddleware');
const {
  createOrder,
  getUserOrders,
  getRestaurantOrders,
  updateOrderStatus,
  getOrderDetails
} = require('../controllers/orderController');

// Create new order (authenticated users)
router.post('/',
  authMiddleware,
  validateOrder,
  createOrder
);

// Get user's order history
router.get('/user', authMiddleware, getUserOrders);

// Get restaurant's orders (for restaurant owners)
router.get('/restaurant/:restaurantId', authMiddleware, getRestaurantOrders);

// Update order status
router.patch('/:orderId/status', authMiddleware, updateOrderStatus);

// Get order details
router.get('/:orderId', authMiddleware, getOrderDetails);

module.exports = router;