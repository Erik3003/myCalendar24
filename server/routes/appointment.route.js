const express = require('express');
const asyncHandler = require('express-async-handler');
const appointmentCtrl = require('../controllers/appointment.controller');
const passport = require('passport');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }));

router.post('/new', asyncHandler(createAppointment));
router.get('/get', asyncHandler(getAppointments));
router.get('/all', asyncHandler(getAllAppointments));
router.post('/update', asyncHandler(updateAppointment));
router.post('/remove', asyncHandler(removeAppointment));
router.post('/add', asyncHandler(addAppointment));
router.post('/invite', asyncHandler(sendInvite));
router.post('/accept', asyncHandler(acceptInvite));
router.get('/invites', asyncHandler(getInvites));
router.get('/public', asyncHandler(getPublic));


async function createAppointment(req, res) {
  let appointment = await appointmentCtrl.insert(req.body, req.user);
  res.json({ appointment, Success: true });
}

async function getAppointments(req, res) {
  let appointments = await appointmentCtrl.extract(req.header('dateParams'), req.user);
  res.json(appointments);
}

async function getAllAppointments(req, res) {
  let appointments = await appointmentCtrl.all(req.user);
  res.json(appointments);
}

async function getPublic(req, res) {
  let appointments = await appointmentCtrl.public();
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

async function getInvites(req, res) {
  invites = await appointmentCtrl.invites(req.user);

  res.json( invites );
}

async function sendInvite(req, res) {
  invite = await appointmentCtrl.invite(req.user, req.body.appointment, req.body.target);

  if (invite.Status != null) {
    return res.status(invite.Status).send("Error code: " + invite.Status);
  }

  res.json(invite);
}

async function acceptInvite(req, res) {
  invite = await appointmentCtrl.accept(req.user, req.body);

  if (invite.Status != null) {
    return res.status(invite.Status).send("Error code: " + invite.Status);
  }

  res.json(invite);
}