const express = require('express');
const asyncHandler = require('express-async-handler');
const appointmentCtrl = require('../controllers/appointment.controller');
const passport = require('passport');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }))

router.post('/new', asyncHandler(createAppointment));
router.get('/get', asyncHandler(getAppointments));
router.post('/update', asyncHandler(updateAppointment));
router.post('/remove', asyncHandler(removeAppointment));
router.post('/add', asyncHandler(addAppointment));


async function createAppointment(req, res) {
  let appointment = await appointmentCtrl.insert(req.body, req.user);
  res.json({ appointment, Success: true });
}

async function getAppointments(req, res) {
  let appointments = await appointmentCtrl.extract(req.header('dateParams'), req.user);
  res.json(appointments);
}

async function updateAppointment(req, res) {
  let appointment = await appointmentCtrl.update(req.body, req.user);

  if (appointment.Status != null) {
    return res.status(appointment.Status).send("Error code: " + appointment.Status);
  }

  res.json(appointment);
}

async function removeAppointment(req, res) {
  let appointment = await appointmentCtrl.remove(req.body, req.user);

  if (appointment.Status != null) {
    return res.status(appointment.Status).send("Error code: " + appointment.Status);
  }

  res.json(appointment);
}

async function addAppointment(req, res) {
  let appointment = await appointmentCtrl.add(req.body, req.user);

  if (appointment.Status != null) {
    return res.status(appointment.Status).send("Error code: " + appointment.Status);
  }

  res.json(appointment);
}