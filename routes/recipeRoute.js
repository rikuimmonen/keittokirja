'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileFilter = (req, file, cb) => {
  if (file.mimetype.includes('image')) {
    cb(null, true);
  }
};
const upload = multer({dest: './uploads/', fileFilter}); // destination relative to app.js
const {recipe_list_get, recipe_get, recipe_post, recipe_put, recipe_delete} = require(
    '../controllers/recipeController');
const {body} = require('express-validator');
const passport = require('../utils/pass');

router.route('/').
    get(recipe_list_get).
    post(upload.single('recipeImage'),
        //body('name').not().isEmpty().escape(),
        recipe_post,
    );

router.route('/:id').
    put(recipe_put).
    get(recipe_get).
    delete(passport.authenticate('jwt', {session: false}), recipe_delete);

module.exports = router;