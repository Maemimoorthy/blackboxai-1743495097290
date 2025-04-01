const { body, validationResult } = require('express-validator');

const validateRestaurant = [
  body('name').notEmpty().withMessage('Name is required'),
  body('cuisine').notEmpty().withMessage('Cuisine is required'),
  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Invalid coordinates format'),
  body('location.coordinates.*')
    .isFloat()
    .withMessage('Coordinates must be numbers'),
  body('menuItems.*.name').notEmpty().withMessage('Menu item name is required'),
  body('menuItems.*.price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateOrder = [
  body('restaurantId').isMongoId().withMessage('Invalid restaurant ID'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.name').notEmpty().withMessage('Item name is required'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('deliveryAddress.street')
    .notEmpty()
    .withMessage('Street address is required'),
  body('deliveryAddress.city').notEmpty().withMessage('City is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateRestaurant,
  validateOrder
};