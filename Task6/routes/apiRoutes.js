const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.get('/forecasts', apiController.getForecasts);           // Read (All + Pagination/Filter)
router.get('/forecasts/:id', apiController.getForecastById);    // Read (One)
router.post('/forecasts', apiController.createForecast);        // Create
router.put('/forecasts/:id', apiController.updateForecast);     // Update
router.delete('/forecasts/:id', apiController.deleteForecast);  // Delete
router.get('/archive', apiController.getArchive);               // Archive

module.exports = router;