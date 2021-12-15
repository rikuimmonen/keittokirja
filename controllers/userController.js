'use strict';

const {
  getAllUsers,
  getUser,
  getUsersAllRecipes,
  getUsersRecipe,
  editUser,
  deleteUser,
} = require(
    '../models/userModel');
const {httpError} = require('../utils/errors');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(12);

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

const user_put = async (req, res, next) => {
  try {
    const {name, email, password} = req.body;
    const hash = bcrypt.hashSync(password, salt);
    if (req.params.id !== req.user.id) {
      next(httpError('No can do', 404));
    }

    const user = await editUser(req.params.id, name, email, hash, next);
    if (user.length > 0) {
      res.json(user.pop());
    } else {
      next(httpError('No user found', 404));
    }
  } catch (e) {
    console.log('user_put error', e.message);
    next(httpError('Internal server error', 500));
  }
};

const user_delete = async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id) {
      next(httpError('No can do', 404));
    }
    const result = await deleteUser(req.user.id, next);
    if (result.affectedRows > 0) {
      res.json({
        message: 'user deleted',
        recipe_id: result.insertId,
      });
    } else {
      next(httpError('No user found', 400));
    }
  } catch (e) {
    console.log('user_delete error', e.message);
    next(httpError('internal server error', 500));
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
  user_put,
  user_delete,
  checkToken,
};