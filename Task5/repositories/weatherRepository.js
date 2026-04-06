const { Op } = require('sequelize');
const { sequelize, Location, ForecastDate, WeatherForecast, WeatherArchive } = require('../models/index');

const toFlat = (r) => ({
    ForecastID: r.ForecastID,
    location: r.Location.Name,
    date: r.ForecastDate.FullDate,
    forecast: r.Summary,
    temperature: r.Temperature
});

exports.getAllForecasts = async () => {
    const results = await WeatherForecast.findAll({
        include: [
            { model: Location, attributes: ['Name'] },
            { model: ForecastDate, attributes: ['FullDate'] }
        ]
    });
    return results.map(toFlat);
};

exports.upsertForecastTransaction = async (data) => {
    const t = await sequelize.transaction();
    try {
        const [location] = await Location.findOrCreate({
            where: { Name: data.location },
            transaction: t
        });
        const [forecastDate] = await ForecastDate.findOrCreate({
            where: { FullDate: data.date },
            transaction: t
        });
        const existing = await WeatherForecast.findOne({
            where: { LocationID: location.LocationID, DateID: forecastDate.DateID },
            transaction: t
        });
        if (existing) {
            await existing.update(
                { Summary: data.forecast, Temperature: data.temperature },
                { transaction: t }
            );
        } else {
            await WeatherForecast.create({
                LocationID: location.LocationID,
                DateID: forecastDate.DateID,
                Summary: data.forecast,
                Temperature: data.temperature
            }, { transaction: t });
        }
        await t.commit();
    } catch (err) {
        await t.rollback();
        throw err;
    }
};

exports.deleteForecastTransaction = async (id) => {
    const t = await sequelize.transaction();
    try {
        await WeatherForecast.destroy({ where: { ForecastID: parseInt(id) }, transaction: t });
        await t.commit();
    } catch (err) {
        await t.rollback();
        throw err;
    }
};

exports.archiveOldForecasts = async (beforeDate) => {
    const t = await sequelize.transaction();
    try {
        const forecasts = await WeatherForecast.findAll({
            include: [
                { model: Location, attributes: ['Name'] },
                { model: ForecastDate, where: { FullDate: { [Op.lt]: beforeDate } }, attributes: ['FullDate'] }
            ],
            transaction: t
        });

        for (const f of forecasts) {
            await WeatherArchive.create({
                LocationName: f.Location.Name,
                FullDate: f.ForecastDate.FullDate,
                Summary: f.Summary,
                Temperature: f.Temperature
            }, { transaction: t });
        }

        const ids = forecasts.map(f => f.ForecastID);
        if (ids.length > 0) {
            await WeatherForecast.destroy({ where: { ForecastID: { [Op.in]: ids } }, transaction: t });
        }

        await t.commit();
        return { count: forecasts.length };
    } catch (err) {
        await t.rollback();
        throw err;
    }
};

exports.getArchivedForecasts = async () => {
    const results = await WeatherArchive.findAll({ order: [['ArchivedAt', 'DESC']] });
    return results.map(r => ({
        ArchiveID: r.ArchiveID,
        location: r.LocationName,
        date: r.FullDate,
        forecast: r.Summary,
        temperature: r.Temperature,
        ArchivedAt: r.ArchivedAt
    }));
};
