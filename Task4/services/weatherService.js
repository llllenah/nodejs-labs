const weatherRepository = require("../repositories/weatherRepository");

exports.getForecast = async (location) => {
    const data = await weatherRepository.getAllForecasts();
    if (!location) return data;
    return data.filter(item => item.location.toLowerCase() === location.toLowerCase());
};

exports.addForecast = async (data) => await weatherRepository.createForecastTransaction(data);
exports.deleteForecast = async (id) => await weatherRepository.deleteForecastTransaction(id);
exports.bulkAdjust = async (loc, amount) => await weatherRepository.updateLocationTemperaturesSafe(loc, amount);