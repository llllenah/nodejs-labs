var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var weatherRoutes = require('./routes/weatherRoutes');
var usersRouter = require('./routes/users');
const { sequelize } = require('./models/index');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', weatherRoutes);
app.use('/users', usersRouter);

app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(`Error ${err.status}: ${err.message}`);
});

const PORT = 3000;

sequelize.authenticate()
    .then(() => sequelize.sync())
    .then(() => {
        console.log('Connected to database via Sequelize');
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err.message);
    });
