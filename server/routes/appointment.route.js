const express = require('express');
const asyncHandler = require('express-async-handler');
const appointmentCtrl = require('../controllers/appointment.controller');
const passport = require('passport');

const router = express.Router();
module.exports = router;

// Authentifizierung des Nutzers, Zugriff auf folgende Routen nur bei Erfolg möglich
router.use(passport.authenticate('jwt', { session: false }));

// Route zum Erstellen eines neuen Termins
router.post('/new', asyncHandler(createAppointment));
// Route zum Erhalten aller Termine des Nutzers im gegebenem Monat
router.get('/get', asyncHandler(getAppointments));
// Route zum Erhalten aller Termine des Nutzers am gegebenem Tag 
router.get('/day', asyncHandler(getAppointmentsDay));
// Route zum Erhalten aller Termine des Nutzers
router.get('/all', asyncHandler(getAllAppointments));
// Route zum Ändern eines Termins
router.post('/update', asyncHandler(updateAppointment));
// Route zum Entfernen eines Termins
router.post('/remove', asyncHandler(removeAppointment));
// Route zum Hinzufügen eines bestehenden Termins zu dem Nutzer 
router.post('/add', asyncHandler(addAppointment));
// Route zum Einladen eines Nutzers zu einem Termin
router.post('/invite', asyncHandler(sendInvite));
// Route zum akzeptieren/ablehnen einer Einladung
router.post('/accept', asyncHandler(acceptInvite));
// Route zum Erhalten einer Einladungen des Nutzers
router.get('/invites', asyncHandler(getInvites));
// Route zum Erhalten aller öffentlichen Termine
router.get('/public', asyncHandler(getPublic));
// Route zum Erhalten aller öffentlichen Termine zwischen den gegebenen Daten
router.get('/search', asyncHandler(getPublicLimited));


async function createAppointment(req, res) {
  let appointment = await appointmentCtrl.insert(req.body, req.user);

  if (appointment.Status != null) {
    return res.status(appointment.Status).send("Error code: " + appointment.Status);
  }

  res.json({ appointment, Success: true });
}

async function getAppointments(req, res) {
  let appointments = await appointmentCtrl.extract(req.header('dateParams'), req.user);
  res.json(appointments);
}

async function getAppointmentsDay(req, res) {
  let appointments = await appointmentCtrl.extractDay(req.header('dateParams'), req.user);
  res.json(appointments);
}


async function getAllAppointments(req, res) {
  let appointments = await appointmentCtrl.all(req.user);
  res.json(appointments);
}

async function getPublic(req, res) {
  let appointments = await appointmentCtrl.public(req.user);
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

async function getPublicLimited(req, res) {
  // Daten werden Header entnommen
  dates = req.header('dateParams');

  // Daten werden in Objekt geparsed (Array)
  dates = JSON.parse(dates);
  let appointments = await appointmentCtrl.extractPublic(dates[0], dates[1], req.user);

  if (appointments.Status != null) {
    return res.status(appointments.Status).send("Error code: " + appointments.Status);
  }

  res.json(appointments);
}

async function getInvites(req, res) {
  invites = await appointmentCtrl.invites(req.user);

  res.json(invites);
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