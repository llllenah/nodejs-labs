const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

router.get('/', weatherController.index);
router.get('/archive', weatherController.getArchive);
router.get('/forecast', weatherController.getForecast);
router.post('/forecast', weatherController.getForecast);
router.post('/forecast/save', weatherController.saveForecast);
router.post('/archive', weatherController.archiveData);
router.post('/delete', weatherController.deleteForecast);

module.exports = router;
