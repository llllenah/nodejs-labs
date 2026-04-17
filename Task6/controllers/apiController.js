const weatherRepository = require('../repositories/weatherRepository');

exports.getForecasts = async (req, res) => {
    try {
        const { location, startDate, endDate, page, limit } = req.query;
        const result = await weatherRepository.getForecastsApi({ location, startDate, endDate, page, limit });
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

exports.getForecastById = async (req, res) => {
    try {
        const forecast = await weatherRepository.getForecastById(req.params.id);
        if (!forecast) return res.status(404).json({ message: 'Forecast not found' });

        res.status(200).json(forecast);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createForecast = async (req, res) => {
    try {
        const { location, date, forecast, temperature } = req.body;
        if (!location || !date || !forecast || temperature === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        await weatherRepository.upsertForecastTransaction(req.body);
        res.status(201).json({ message: 'Forecast created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateForecast = async (req, res) => {
    try {
        const updated = await weatherRepository.updateForecastById(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: 'Forecast not found' });

        res.status(200).json({ message: 'Forecast updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteForecast = async (req, res) => {
    try {
        const forecast = await weatherRepository.getForecastById(req.params.id);
        if (!forecast) return res.status(404).json({ message: 'Forecast not found' });

        await weatherRepository.deleteForecastTransaction(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getArchive = async (req, res) => {
    try {
        const archivedData = await weatherRepository.getArchivedForecasts();
        res.status(200).json(archivedData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};