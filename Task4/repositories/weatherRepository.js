const { sql, poolPromise } = require("../config/dbConfig");

// READ
exports.getAllForecasts = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query(`
        SELECT WF.ForecastID, L.Name as location, D.FullDate as date, 
               WF.Summary as forecast, WF.Temperature as temperature
        FROM WeatherForecasts WF
        JOIN Locations L ON WF.LocationID = L.LocationID
        JOIN Dates D ON WF.DateID = D.DateID
    `);
    return result.recordset;
};

exports.upsertForecastTransaction = async (data) => {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();
        
        let locRes = await transaction.request()
            .input('name', sql.NVarChar, data.location)
            .query(`IF NOT EXISTS (SELECT 1 FROM Locations WHERE Name = @name)
                    INSERT INTO Locations (Name) OUTPUT INSERTED.LocationID VALUES (@name)
                    ELSE SELECT LocationID FROM Locations WHERE Name = @name`);
        const locationId = locRes.recordset[0].LocationID;

        let dateRes = await transaction.request()
            .input('fDate', sql.Date, data.date)
            .query(`IF NOT EXISTS (SELECT 1 FROM Dates WHERE FullDate = @fDate)
                    INSERT INTO Dates (FullDate) OUTPUT INSERTED.DateID VALUES (@fDate)
                    ELSE SELECT DateID FROM Dates WHERE FullDate = @fDate`);
        const dateId = dateRes.recordset[0].DateID;

        let existing = await transaction.request()
            .input('lId', sql.Int, locationId)
            .input('dId', sql.Int, dateId)
            .query(`SELECT ForecastID FROM WeatherForecasts WHERE LocationID = @lId AND DateID = @dId`);

        if (existing.recordset.length > 0) {
            await transaction.request()
                .input('fId', sql.Int, existing.recordset[0].ForecastID)
                .input('sum', sql.NVarChar, data.forecast)
                .input('temp', sql.Int, data.temperature)
                .query(`UPDATE WeatherForecasts SET Summary = @sum, Temperature = @temp WHERE ForecastID = @fId`);
        } else {
            await transaction.request()
                .input('lId', sql.Int, locationId)
                .input('dId', sql.Int, dateId)
                .input('sum', sql.NVarChar, data.forecast)
                .input('temp', sql.Int, data.temperature)
                .query(`INSERT INTO WeatherForecasts (LocationID, DateID, Summary, Temperature) VALUES (@lId, @dId, @sum, @temp)`);
        }

        await transaction.commit();
        return { success: true };
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

exports.deleteForecastTransaction = async (id) => {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();
        await transaction.request()
            .input('id', sql.Int, id)
            .query(`DELETE FROM WeatherForecasts WHERE ForecastID = @id`);
        await transaction.commit();
        return { success: true };
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

exports.archiveOldForecasts = async (beforeDate) => {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();
        await transaction.request()
            .input('targetDate', sql.Date, beforeDate)
            .query(`INSERT INTO WeatherArchive (ForecastID, LocationName, FullDate, Summary, Temperature)
                    SELECT WF.ForecastID, L.Name, D.FullDate, WF.Summary, WF.Temperature
                    FROM WeatherForecasts WF
                    JOIN Locations L ON WF.LocationID = L.LocationID
                    JOIN Dates D ON WF.DateID = D.DateID
                    WHERE D.FullDate < @targetDate`);

        const deleteResult = await transaction.request()
            .input('targetDate', sql.Date, beforeDate)
            .query(`DELETE FROM WeatherForecasts WHERE DateID IN (SELECT DateID FROM Dates WHERE FullDate < @targetDate)`);

        await transaction.commit();
        return { success: true, count: deleteResult.rowsAffected[0] };
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

exports.getArchivedForecasts = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query(`
        SELECT 
            ArchiveID, 
            LocationName AS location, 
            FullDate AS date, 
            Summary AS forecast, 
            Temperature AS temperature, 
            ArchivedAt
        FROM WeatherArchive 
        ORDER BY ArchivedAt DESC
    `);
    return result.recordset;
};