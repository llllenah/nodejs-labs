const sequelize = require('../config/db');
const Location = require('./Location');
const ForecastDate = require('./ForecastDate');
const WeatherForecast = require('./WeatherForecast');
const WeatherArchive = require('./WeatherArchive');

Location.hasMany(WeatherForecast, { foreignKey: 'LocationID' });
WeatherForecast.belongsTo(Location, { foreignKey: 'LocationID' });

ForecastDate.hasMany(WeatherForecast, { foreignKey: 'DateID' });
WeatherForecast.belongsTo(ForecastDate, { foreignKey: 'DateID' });

module.exports = { sequelize, Location, ForecastDate, WeatherForecast, WeatherArchive };
