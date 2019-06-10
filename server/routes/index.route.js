const express = require('express');
const appointmentRoutes = require('./appointment.route');
const usersRoutes = require('./users.route');
const categoryRoutes = require('./category.route');

// Express-Router erhalten
const router = express.Router();

// API-Subrouten setzen
router.use('/appointment', appointmentRoutes);
router.use('/user', usersRoutes);
router.use('/category', categoryRoutes);

module.exports = router;
