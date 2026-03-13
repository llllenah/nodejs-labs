const weatherService = require("../services/weatherService");

exports.index = (req, res) => {
    res.render("index");
};

exports.getForecast = async (req, res) => {

    const location = req.body.location || req.query.location;

    const forecast = await weatherService.getForecast(location);

    res.render("forecast", {
        forecast,
        location
    });
};
