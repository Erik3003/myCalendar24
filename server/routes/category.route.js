const express = require('express');
const asyncHandler = require('express-async-handler');
const categoryCtrl = require('../controllers/category.controller');
const passport = require('passport');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }))

router.post('/new', asyncHandler(newCategory));
router.post('/update', asyncHandler(updateCategory));
router.post('/remove', asyncHandler(removeCategory));
router.get('/get', asyncHandler(getCategories));

async function newCategory(req, res) {
  let category = await categoryCtrl.insert(req.body, req.user);
  res.json({ category });
}

async function getCategories(req, res) {
  let category = await categoryCtrl.get(req.user);

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