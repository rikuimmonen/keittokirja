'use strict';

const express = require('express');
const router = express.Router();
const {
  user_list_get,
  user_get,
  checkToken,
  user_recipe_list_get,
  user_recipe_get,
} = require('../controllers/userController');
const passport = require('../utils/pass');

router.get('/token', passport.authenticate('jwt', {session: false}),
    checkToken);
router.get('/', user_list_get);
router.get('/:id', user_get);
router.get('/:id/recipe/', user_recipe_list_get);
router.get('/:id/recipe/:r_id', user_recipe_get);

router.put('/', (req, res) => {
  res.send('With this endpoint you can edit users.');
});

router.delete('/', (req, res) => {
  res.send('With this endpoint you can delete users.');
});

module.exports = router;