const express = require("express");
const router = express.Router();

const weatherController = require("../controllers/weatherController");

router.get("/", weatherController.index);
router.post("/forecast", weatherController.getForecast);

module.exports = router;
