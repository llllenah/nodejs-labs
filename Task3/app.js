var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var weatherRoutes = require('./routes/weatherRoutes');
var usersRouter = require('./routes/users');
var weatherRepository = require('./repositories/weatherRepository');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', weatherRoutes);
app.use('/users', usersRouter);

// 404 handler
app.use((req, res, next) => {
    next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(`Error ${err.status}: ${err.message}`);
});

const PORT = 3000;

app.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`);

    console.log('\n--- Демонстрація 4 способів читання даних ---');

    // 1. Синхронний
    const sync = weatherRepository.getAllForecastsSync();
    console.log('1. Синхронний (readFileSync):', sync.length, 'записів');

    // 2. Callback
    weatherRepository.getAllForecastsCallback((err, data) => {
        if (!err) console.log('2. Callback (readFile):', data.length, 'записів');
    });

    // 3. Promise
    weatherRepository.getAllForecastsPromise()
        .then(data => console.log('3. Promise (.then):', data.length, 'записів'));

    // 4. Async/Await
    const asyncData = await weatherRepository.getAllForecasts();
    console.log('4. Async/Await (promises.readFile):', asyncData.length, 'записів');
});
