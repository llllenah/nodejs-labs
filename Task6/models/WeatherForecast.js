const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WeatherForecast = sequelize.define('WeatherForecast', {
    ForecastID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Summary: { type: DataTypes.STRING, allowNull: false },
    Temperature: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'WeatherForecasts', timestamps: false });

module.exports = WeatherForecast;
