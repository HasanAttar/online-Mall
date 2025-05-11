var express = require('express');
const cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRoutes');
var shopRouter = require('./routes/shopRoutes');
var productRouter = require('./routes/productRoutes');
var categoryRouter = require('./routes/categoryRoutes');
var orderRouter = require('./routes/orderRoutes');
var deliveryRouter = require('./routes/deliveryRoutes');
var paymentRouter = require('./routes/paymentRoutes');
var adminRouter = require('./routes/adminRoutes');
var cartRouter=require('./routes/cartRoutes')

var app = express();

// CORS configuration
app.use(
  cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow credentials like cookies and headers
  })
);

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Route definitions
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/api/shops', shopRouter); // Updated to match consistent naming
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/orders', orderRouter);
app.use('/api/delivery', deliveryRouter);
app.use('/api/cart', cartRouter);
app.use('/api/payments', paymentRouter); // Updated plural naming for consistency

// Health check or CORS test endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'API is working and CORS is configured!' });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

module.exports = app;
