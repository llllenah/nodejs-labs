const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WeatherArchive = sequelize.define('WeatherArchive', {
    ArchiveID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    LocationName: { type: DataTypes.STRING, allowNull: false },
    FullDate: { type: DataTypes.DATEONLY, allowNull: false },
    Summary: { type: DataTypes.STRING, allowNull: false },
    Temperature: { type: DataTypes.INTEGER, allowNull: false },
    ArchivedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'WeatherArchive', timestamps: false });

module.exports = WeatherArchive;
