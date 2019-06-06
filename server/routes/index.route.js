const express = require('express');
const appointmentRoutes = require('./appointment.route');
const usersRoutes = require('./users.route');

const router = express.Router();

router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/appointment', appointmentRoutes);
router.use('/user', usersRoutes);

module.exports = router;
