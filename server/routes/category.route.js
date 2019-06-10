const express = require('express');
const asyncHandler = require('express-async-handler');
const categoryCtrl = require('../controllers/category.controller');
const passport = require('passport');

const router = express.Router();
module.exports = router;

// Authentifizierung des Nutzers, Zugriff auf folgende Routen nur bei Erfolg möglich
router.use(passport.authenticate('jwt', { session: false }))

//Route zum Erstellen einer neuen Kategorie
router.post('/new', asyncHandler(newCategory));
//Route zum Ändern einer bestehenden Kategorie
router.post('/update', asyncHandler(updateCategory));
//Route zum Löschen einer bestehenden Kategorie
router.post('/remove', asyncHandler(removeCategory));
//Route zum Erhalten aller Kategorien, die der Nutzer erstellt hat
router.get('/get', asyncHandler(getCategories));
//Route zum Erhalten einer Kategorie
router.post('/one', asyncHandler(getCategory));

async function newCategory(req, res) {
  let category = await categoryCtrl.insert(req.body, req.user);
  res.json({ category });
}

async function getCategories(req, res) {
  let category = await categoryCtrl.get(req.user);

  // Bei Fehler wird der Fehlercode geschickt
  if (category.Status != null) {
    return res.status(category.Status).send("Error code: " + category.Status);
  }

  res.json(category);
}

async function getCategory(req, res) {
  let category = await categoryCtrl.getCategory(req.body);

  if (category.Status != null) {
    return res.status(category.Status).send("Error code: " + category.Status);
  }

  res.json(category);
}

async function removeCategory(req, res) {
  let category = await categoryCtrl.remove(req.body, req.user);

  if (category.Status != null) {
    return res.status(category.Status).send("Error code: " + category.Status);
  }

  res.json({ category });
}

async function updateCategory(req, res) {
  let category = await categoryCtrl.update(req.body, req.user);

  if (category.Status != null) {
    return res.status(category.Status).send("Error code: " + category.Status);
  }

  res.json({ category });
}