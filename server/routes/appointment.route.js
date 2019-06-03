const express = require('express');
const asyncHandler = require('express-async-handler');
const appointmentCtrl = require('../controllers/appointment.controller');
const passport = require('passport');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }))

router.post('/new', asyncHandler(addAppointment));
//router.get('/get/:creator', asyncHandler(getAppointment));
router.get('/get', asyncHandler(getAppointment));


async function addAppointment(req, res) {
  let appointment = await appointmentCtrl.insert(req.body);
  res.json({ appointment, Success: true });
}

async function getAppointment(req, res) {
  //let creatorToken = req.params.creator;
  let appointments = await appointmentCtrl.extract(/*creatorID*/)
  res.json(appointments);
}