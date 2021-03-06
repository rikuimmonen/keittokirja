'use strict';

const express = require('express');
const router = express.Router();
const {
  checkToken,
  user_list_get,
  user_get,
  user_recipe_list_get,
  user_recipe_get,
  user_put,
  user_delete,
} = require('../controllers/userController');
const passport = require('../utils/pass');

router.get('/token', passport.authenticate('jwt', {session: false}),
    checkToken);
router.get('/', passport.authenticate('jwt', {session: false}), user_list_get);
router.get('/:id', user_get);
router.get('/:id/recipe/', user_recipe_list_get);
router.get('/:id/recipe/:r_id', user_recipe_get);
router.put('/:id', passport.authenticate('jwt', {session: false}), user_put);
router.delete('/:id', passport.authenticate('jwt', {session: false}),
    user_delete);

module.exports = router;