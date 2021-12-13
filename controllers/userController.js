'use strict';

const {getAllUsers, getUser, getUsersAllRecipes, getUsersRecipe} = require(
    '../models/userModel');
const {httpError} = require('../utils/errors');

const user_list_get = async (req, res, next) => {
  try {
    const users = await getAllUsers(next);
    if (users.length > 0) {
      res.json(users);
    } else {
      next(httpError('No users found', 404));
    }
  } catch (e) {
    console.log('user_list_get error', e.message);
    next(httpError('Internal server error', 500));
  }
};

const user_get = async (req, res, next) => {
  try {
    const user = await getUser(req.params.id, next);
    if (user.length > 0) {
      res.json(user.pop());
    } else {
      next(httpError('No user found', 404));
    }
  } catch (e) {
    console.log('user_get error', e.message);
    next(httpError('Internal server error', 500));
  }
};

const user_recipe_list_get = async (req, res, next) => {
  try {
    const recipes = await getUsersAllRecipes(req.params.id, next);
    if (recipes.length > 0) {
      res.json(recipes);
    } else {
      next(httpError('User does not have recipes or they do not exist', 404));
    }
  } catch (e) {
    console.log('user_recipe_list_get error', e.message);
    next(httpError('Internal server error', 500));
  }
};

const user_recipe_get = async (req, res, next) => {
  try {
    const recipe = await getUsersRecipe(req.params.id, req.params.r_id, next);
    if (recipe.length > 0) {
      res.json(recipe.pop());
    } else {
      next(httpError('No user found', 404));
    }
  } catch (e) {
    console.log('user_recipe_get error', e.message);
    next(httpError('Internal server error', 500));
  }
};

const checkToken = (req, res, next) => {
  if (!req.user) {
    next(new Error('token not valid'));
  } else {
    res.json({user: req.user});
  }
};

module.exports = {
  user_list_get,
  user_get,
  user_recipe_list_get,
  user_recipe_get,
  checkToken,
};