'use strict';

const {getAllRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe} = require(
    '../models/recipeModel');
const {httpError} = require('../utils/errors');
const {validationResult} = require('express-validator');
const {makeThumbnail} = require('../utils/resize');

const recipe_list_get = async (req, res, next) => {
  try {
    const recipes = await getAllRecipes(next);
    if (recipes.length > 0) {
      res.json(recipes);
    } else {
      next(httpError('No recipes found', 404));
    }
  } catch (e) {
    console.log('recipe_list_get error', e.message);
    next(httpError('internal server error', 500));
  }
};

const recipe_get = async (req, res, next) => {
  try {
    const recipe = await getRecipe(req.params.id, next);
    if (recipe.length > 0) {
      res.json(recipe.pop());
    } else {
      next(httpError('No recipe found', 404));
    }
  } catch (e) {
    console.log('recipe_get error', e.message);
    next(httpError('internal server error', 500));
  }
};

const recipe_post = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log('recipe_post validation', errors.array());
    next(httpError('invalid data', 400));
    return;
  }

  if (!req.file) {
    const err = httpError('file not valid', 400);
    next(err);
    return;
  }

  try {
    const thumbnail = await makeThumbnail(
        req.file.path,
        './thumbnails/' + req.file.filename,
    );
    const {
      recipeTitle,
      recipeSize,
      recipeTime,
      recipeIngredient,
      recipeDirection,
    } = req.body;
    const img = req.file.filename;
    const user_id = req.user.id;
    const result = await addRecipe(recipeTitle, recipeSize, recipeTime,
        recipeIngredient, recipeDirection, user_id, img, next);
    if (thumbnail) {
      if (result.affectedRows > 0) {
        res.json({
          message: 'recipe added',
          recipe_id: result.insertId,
        });
      }
    } else {
      next(httpError('No recipe inserted', 400));
    }
  } catch (e) {
    console.log('recipe_post error', e.message);
    next(httpError('Internal server error', 500));
  }
};

const recipe_put = async (req, res, next) => {
  try {
    const {
      recipeTitle,
      recipeSize,
      recipeTime,
      recipeIngredient,
      recipeDirection,
    } = req.body;

    const result = await editRecipe(req.params.id, recipeTitle, recipeSize,
        recipeTime, recipeIngredient, recipeDirection, req.user.id, next);
    if (result.affectedRows > 0) {
      res.json({
        message: 'recipe edited',
        recipe_id: result.insertId,
      });

    } else {
      next(httpError('No recipe edited', 400));
    }
  } catch (e) {
    console.log('recipe_put error', e.message);
    next(httpError('Internal server error', 500));
  }
};

const recipe_delete = async (req, res, next) => {
  try {
    console.log(req.params, req.user);
    const result = await deleteRecipe(req.params.id, req.user.id,
        req.user.role, next);
    if (result.affectedRows > 0) {
      res.json({
        message: 'recipe deleted',
        recipe_id: result.insertId,
      });
    } else {
      next(httpError('No recipe found', 400));
    }
  } catch (e) {
    console.log('recipe_delete error', e.message);
    next(httpError('internal server error', 500));
  }
};

module.exports = {
  recipe_list_get,
  recipe_get,
  recipe_post,
  recipe_put,
  recipe_delete,
};