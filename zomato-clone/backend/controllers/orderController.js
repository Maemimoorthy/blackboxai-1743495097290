const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { restaurantId, items, deliveryAddress } = req.body;
    const userId = req.user.userId;

    // Validate restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Calculate total and validate menu items
    let total = 0;
    const validatedItems = items.map(item => {
      const menuItem = restaurant.menuItems.find(menuItem => 
        menuItem.name === item.name
      );
      if (!menuItem) {
        throw new Error(`Item not found: ${item.name}`);
      }
      total += menuItem.price * item.quantity;
      return {
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity
      };
    });

    // Create order
    const order = new Order({
      user: userId,
      restaurant: restaurantId,
      items: validatedItems,
      total,
      deliveryAddress,
      status: 'pending'
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('restaurant', 'name cuisine imageUrl');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get restaurant's orders
exports.getRestaurantOrders = async (req, res) => {
  try {
    const orders = await Order.find({ restaurant: req.params.restaurantId })
      .populate('user', 'email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get order details
exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('user', 'email')
      .populate('restaurant', 'name cuisine imageUrl');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
