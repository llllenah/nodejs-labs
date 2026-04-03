const weatherService = require("../services/weatherService");
const weatherRepository = require("../repositories/weatherRepository");

exports.index = (req, res) => {
    res.render("index", { message: null });
};

exports.getForecast = async (req, res) => {
    try {
        const location = req.body.location || req.query.location;
        const forecast = await weatherService.getForecast(location);
        res.render("forecast", { forecast, location, message: null, error: null });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.saveForecast = async (req, res) => {
    try {
        await weatherRepository.upsertForecastTransaction(req.body);
        res.redirect('/'); 
    } catch (err) {
        res.status(500).send("Saving error: " + err.message);
    }
};

exports.archiveData = async (req, res) => {
    try {
        const result = await weatherRepository.archiveOldForecasts(req.body.beforeDate);
        const forecast = await weatherService.getForecast();
        res.render("forecast", { 
            forecast, location: "All Records", 
            message: `${result.count} records were successfuly archived`, error: null 
        });
    } catch (err) {
        res.render("forecast", { forecast: [], location: "Error", message: null, error: err.message });
    }
};

exports.getArchive = async (req, res) => {
    const archivedData = await weatherRepository.getArchivedForecasts();
    res.render("archive", { archivedData });
};

exports.deleteForecast = async (req, res) => {
    await weatherRepository.deleteForecastTransaction(req.body.id);
    res.redirect("/forecast?location=" + req.body.location);
};