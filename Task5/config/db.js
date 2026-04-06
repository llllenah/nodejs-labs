const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ForecastDB', 'sa', 'Forecast@2024', {
    host: 'localhost',
    dialect: 'mssql',
    dialectOptions: {
        options: {
            encrypt: true,
            trustServerCertificate: true
        }
    },
    logging: false
});

module.exports = sequelize;
