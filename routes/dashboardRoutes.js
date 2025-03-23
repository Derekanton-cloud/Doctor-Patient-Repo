const express = require("express");
const router = express.Router();
const { getDashboardData } = require("../controllers/dashboardController");

// Dashboard route (example for both patients and doctors)
router.get("/", getDashboardData);

module.exports = router;
