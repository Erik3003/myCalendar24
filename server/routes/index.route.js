const express = require('express');
const appointmentRoutes = require('./appointment.route');
const userRoutes = require('./users.route');

const router = express.Router();

router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/appointment', appointmentRoutes);
router.use('/user', userRoutes);

module.exports = router;
