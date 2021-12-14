'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();
const {httpError} = require('../utils/errors');

const addIngredient = async (ingredients, recipe_id, next) => {
  try {
    let rows = [];
    let row = '';

    if (!Array.isArray(ingredients)) {
      let ingredient = ingredients;
      ingredients = [];
      ingredients.push(ingredient)
    }

    for (let i = 0; i < ingredients.length; i++) {
      [row] = await promisePool.execute(
          'INSERT INTO ingredient (content, recipe_id) VALUES (?, ?);',
          [ingredients[i], recipe_id]);

      rows.push(row);
    }

    return rows;
  } catch (e) {
    console.error('addIngredient error', e.message);
    next(httpError('Database error', 500));
  }
};

const getIngredients = async (recipe_id, next) => {
  try {
    let ingredients = [];

    let [ingredientsRaw] = await promisePool.execute(
        'SELECT content FROM ingredient WHERE recipe_id = ' + recipe_id + ';');

    for (let j = 0; j < ingredientsRaw.length; j++) {
      ingredients[j] = ingredientsRaw[j].content;
    }

    return ingredients;
  } catch (e) {
    console.error('getIngredients error', e.message);
    next(httpError('Database error', 500));
  }
};

module.exports = {
  addIngredient,
  getIngredients,
};