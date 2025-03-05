const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false // Set to console.log to see SQL queries
});

// Import models
const User = require('./user')(sequelize);
const Link = require('./link')(sequelize);
const Setting = require('./setting')(sequelize);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync database and create admin user if it doesn't exist
    await sequelize.sync();
    
    // Create default admin user if none exists
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        password: 'admin123' // This will be hashed by the User model hooks
      });
      console.log('Default admin user created.');
    }

    // Create default settings if none exist
    const settingsExist = await Setting.findOne({ where: { id: 1 } });
    if (!settingsExist) {
      await Setting.create({
        backgroundColor: '#f8fafc',
        profileImage: 'default-profile.png',
        title: 'Your Name',
        description: 'Your Bio',
        primaryColor: '#3b82f6'
      });
      console.log('Default settings created.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Run the connection test
testConnection();

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Link,
  Setting
};
