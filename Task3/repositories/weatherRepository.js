const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/forecast.json");

exports.getAllForecasts = async () => {
    const data = await fs.promises.readFile(filePath, "utf8");
    return JSON.parse(data);
};

exports.getAllForecastsSync = () => {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
};

exports.getAllForecastsCallback = (callback) => {
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) return callback(err);

        callback(null, JSON.parse(data));
    });
};

exports.getAllForecastsPromise = () => {
    return fs.promises.readFile(filePath, "utf8")
        .then(data => JSON.parse(data));
};
