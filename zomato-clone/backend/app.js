const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

// Database connection
connectDB();

// API Routes
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurants');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Zomato Clone API',
    status: 'running',
    version: '1.0.0'
  });
});

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// API documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const errorHandler = require('./middlewares/errorHandler');

// Use error handler (must be after all routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
