const weatherRepository = require("../repositories/weatherRepository");

exports.getForecast = async (location) => {
    const data = await weatherRepository.getAllForecasts();
    if (!location) return data;
    return data.filter(item => item.location.toLowerCase() === location.toLowerCase());
};

exports.saveForecast = async (data) => await weatherRepository.upsertForecastTransaction(data);
exports.deleteForecast = async (id) => await weatherRepository.deleteForecastTransaction(id);