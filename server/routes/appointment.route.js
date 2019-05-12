const express = require('express');
const asyncHandler = require('express-async-handler');
const appointmentCtrl = require('../controllers/appointment.controller');

const router = express.Router();
module.exports = router;

router.post('/new', asyncHandler(addAppointment));
router.get('/get/:creator', asyncHandler(getAppointment));

async function addAppointment(req, res) {
  let appointment = await appointmentCtrl.insert(req.body);
  res.json({ appointment, "Success": "true" });
}

async function getAppointment(req, res) {
  let creatorID = req.params.creator;
  let appointments = await appointmentCtrl.extract(creatorID)
  res.json(appointments);
}