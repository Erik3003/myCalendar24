const express = require('express');
const appointmentRoutes = require('./appointment.route');

const router = express.Router();

router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/appointment', appointmentRoutes);

module.exports = router;
