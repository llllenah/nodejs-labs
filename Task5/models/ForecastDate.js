const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ForecastDate = sequelize.define('ForecastDate', {
    DateID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    FullDate: { type: DataTypes.DATEONLY, allowNull: false }
}, { tableName: 'Dates', timestamps: false });

module.exports = ForecastDate;
