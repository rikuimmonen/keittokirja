const pool = require('../database/db');
const promisePool = pool.promise();
const {httpError} = require('../utils/errors');
const {getIngredients} = require('./ingredientModel');
const {getDirections} = require('./directionModel');

const getAllUsers = async (next) => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT id, name, email, password FROM user');
    return rows;
  } catch (e) {
    console.error('getAllUsers error', e.message);
    next(httpError('Database error', 500));
  }
};

const getUser = async (id, next) => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT id, name, email, password FROM user WHERE id = ?',
        [id]);
    return rows;
  } catch (e) {
    console.error('getUser error', e.message);
    next(httpError('Database error', 500));
  }
};

const addUser = async (name, email, password, next) => {
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO user (name, email, password) VALUES (?, ?, ?)',
        [name, email, password]);
    return rows;
  } catch (e) {
    console.error('addUser error', e.message);
    next(httpError('Database error', 500));
  }
};

const getUserLogin = async (params) => {
  try {
    console.log('getUserLogin', params);
    const [rows] = await promisePool.execute(
        'SELECT * FROM user WHERE email = ?;', params);
    return rows;
  } catch (e) {
    console.log('getUserLogin error', e.message);
  }
};

const getUsersAllRecipes = async (user_id, next) => {
  try {
    let [row] = await promisePool.execute(
        'SELECT recipe.id AS recipe_id, title, date, size, time, recipe.image_url AS recipe_image, user.id AS user_id FROM recipe LEFT JOIN user ON creator = user.id WHERE creator = ?',
        [user_id]);

    for (let i = 0; i < row.length; i++) {
      const img = row[i].recipe_image;
      row[i].recipe_image = {
        'big': '/img/big/' + img + '.jpeg',
        'small': '/img/small/' + img + '.jpeg',
      };
    }

    for (let i = 0; i < row.length; i++) {
      row[i].ingredients = await getIngredients(row[i].recipe_id, next);
      row[i].directions = await getDirections(row[i].recipe_id, next);
    }

    return row;
  } catch (e) {
    console.error('getUserRecipeList error', e.message);
    next(httpError('Database error', 500));
  }
};

const getUsersRecipe = async (user_id, recipe_id, next) => {
  try {
    let [row] = await promisePool.execute(
        'SELECT recipe.id AS recipe_id, title, date, size, time, recipe.image_url AS recipe_image, user.id AS user_id, name FROM recipe LEFT JOIN user ON creator = user.id WHERE user.id = ? AND recipe.id = ?;',
        [user_id, recipe_id]);

    const img = row[0].recipe_image;
    row[0].recipe_image = {
      'big': '/img/big/' + img + '.jpeg',
      'small': '/img/small/' + img + '.jpeg',
    };

    row[0].ingredients = await getIngredients(recipe_id, next);
    row[0].directions = await getDirections(recipe_id, next);

    return row;
  } catch (e) {
    console.error('getUsersRecipe error', e.message);
    next(httpError('Database error', 500));
  }
};

const editUser = async (id, name, email, password, next) => {
  try {
    const [rows] = await promisePool.execute(
        'UPDATE user SET name = ?, email = ?, password = ? WHERE id = ?',
        [name, email, password, id]);
    return rows;
  } catch (e) {
    console.error('editUser error', e.message);
    next(httpError('Database error', 500));
  }
};

const deleteUser = async (id, next) => {
  try {
    const [rows] = await promisePool.execute('DELETE FROM user WHERE id = ?',
        [id]);
    return rows;
  } catch (e) {
    console.error('deleteUser error', e.message);
    next(httpError('Database error', 500));
  }
};

module.exports = {
  getAllUsers,
  getUser,
  addUser,
  getUsersAllRecipes,
  getUsersRecipe,
  getUserLogin,
  editUser,
  deleteUser,
};
