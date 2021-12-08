'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();
const {httpError} = require('../utils/errors');

const getAllRecipes = async (next) => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM kk_recipe');
    return rows;
  } catch (e) {
    console.error('getAllRecipes error', e.message);
    next(httpError('Database error', 500));
  }
};

const getRecipe = async (id, next) => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT * FROM kk_recipe WHERE kk_recipe.id = ?', [id]);
    return rows;
  } catch (e) {
    console.error('getRecipe error', e.message);
    next(httpError('Database error', 500));
  }
};

const addRecipe = async (name, next) => {
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO kk_recipe (name) VALUES (?)', [name]);
    return rows;
  } catch (e) {
    console.error('addRecipe error', e.message);
    next(httpError('Database error', 500));
  }
};

const editRecipe = async (id, name, creator, role, next) => {
  let sql = 'UPDATE kk_recipe SET name = ?, WHERE kk_recipe.id = ? AND creator = ?';
  let params = [name, id, creator];

  if (role === 0) {
    sql = 'UPDATE kk_recipe SET name = ?, WHERE kk_recipe.id = ?';
    params = [name, id];
  }

  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows;
  } catch (e) {
    console.error('editCat error', e.message);
    next(httpError('Database error', 500));
  }
};

const deleteRecipe = async (id, owner, role, next) => {
  let sql = 'DELETE FROM kk_recipe WHERE id = ? AND owner = ?';
  let params = [id, owner];

  if (role === 0) {
    sql = 'DELETE FROM wop_cat WHERE cat_id = ?';
    params = [id];
  }

  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows;
  } catch (e) {
    console.error('deleteCat error', e.message);
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
