const weatherRepository = require('../repositories/weatherRepository');

exports.getForecast = async (location) => {
    const data = await weatherRepository.getAllForecasts();
    if (!location) return data;
    return data.filter(item => item.location.toLowerCase() === location.toLowerCase());
};
