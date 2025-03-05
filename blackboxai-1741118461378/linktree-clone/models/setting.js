const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Setting = sequelize.define('Setting', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    backgroundColor: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '#f8fafc'
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'default-profile.png'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Your Name'
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Your Bio'
    },
    primaryColor: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '#3b82f6' // Default blue color
    }
  });

  return Setting;
};
