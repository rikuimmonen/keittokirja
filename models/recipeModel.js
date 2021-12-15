'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();
const {httpError} = require('../utils/errors');
const {addIngredient, getIngredients, editIngredient} = require(
    './ingredientModel');
const {addDirection, getDirections, editDirection} = require(
    './directionModel');

const getAllRecipes = async (next) => {
  try {
    let [row] = await promisePool.execute(
        'SELECT recipe.id AS recipe_id, title, date, size, time, recipe.image_url AS recipe_image, user.id AS user_id, name FROM recipe LEFT JOIN user ON creator = user.id;');

    for (let i = 0; i < row.length; i++) {
      row[i].ingredients = await getIngredients(row[i].recipe_id, next);
      row[i].directions = await getDirections(row[i].recipe_id, next);
    }

    return row;
  } catch (e) {
    console.error('getAllRecipes error', e.message);
    next(httpError('Database error', 500));
  }
};

const getRecipe = async (id, next) => {
  try {
    let [row] = await promisePool.execute(
        'SELECT recipe.id AS recipe_id, title, date, size, time, recipe.image_url AS recipe_image, user.id AS user_id, name FROM recipe LEFT JOIN user ON creator = user.id WHERE recipe.id = ? ;',
        [id]);

    row[0].ingredients = await getIngredients(id, next);
    row[0].directions = await getDirections(id, next);

    return row;
  } catch (e) {
    console.error('getRecipe error', e.message);
    next(httpError('Database error', 500));
  }
};

const addRecipe = async (
    title, size, time, ingredients, directions, creator, img, next) => {
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO recipe (title, size, time, creator, image_url, date) VALUES (?, ?, ?, ?, ?, NOW());',
        [title, size, time, creator, img]);
    await addIngredient(ingredients, rows.insertId, next);
    await addDirection(directions, rows.insertId, next);
    return rows;
  } catch (e) {
    console.error('addRecipe error', e.message);
    next(httpError('Database error', 500));
  }
};

const editRecipe = async (
    id, title, size, time, ingredients, directions, creator, next) => {

  try {
    const [rows] = await promisePool.execute(
        'UPDATE recipe SET title = ?, size = ?, time = ? WHERE recipe.id = ? AND creator = ?',
        [title, size, time, id, creator]);
    await editDirection(directions, id, next);
    await editIngredient(ingredients, id, next);
    return rows;
  } catch (e) {
    console.error('editRecipe error', e.message);
    next(httpError('Database error', 500));
  }
};

const deleteRecipe = async (id, creator, role, next) => {
  let sql = 'DELETE FROM recipe WHERE id = ? AND creator = ?';
  let params = [id, creator];

  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows;
  } catch (e) {
    console.error('deleteRecipe error', e.message);
    next(httpError('Database error', 500));
  }
};

module.exports = {
  getAllRecipes,
  getRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe,
};
