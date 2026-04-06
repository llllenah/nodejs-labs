const sql = require('mssql');

const config = {
    user: 'sa', 
    password: 'Forecast@2024',
    server: 'localhost', 
    database: 'ForecastDB', 
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected SQL Server');
        return pool;
    })
    .catch(err => console.log('Connection error: ', err));

module.exports = { sql, poolPromise };