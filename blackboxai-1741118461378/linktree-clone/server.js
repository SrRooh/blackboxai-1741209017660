const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import database models
const db = require('./models');

// Initialize Express app
const app = express();

// Database setup
const sequelize = db.sequelize;

// Configure Tailwind
app.use((req, res, next) => {
  res.locals.tailwind = {
    theme: {
      extend: {
        colors: {
          primary: '#0ea5e9',
          'primary-dark': '#0284c7'
        }
      }
    }
  };
  next();
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import routes (we'll create these files next)
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');

// Use routes
app.use('/', indexRoutes);
app.use('/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;

// Database sync and server start
sequelize.sync()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });
