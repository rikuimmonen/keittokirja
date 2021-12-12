'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();
const {httpError} = require('../utils/errors');

const addIngredient = async (ingredients, recipe_id, next) => {
  try {
    let rows = [];
    let row;
    let previous;

    if (Array.isArray(ingredients)) {
      for (let i = 0; i < ingredients.length; i++) {
        if (i === 0) {
          [row] = await promisePool.execute(
              'INSERT INTO ingredient (content, recipe_id) VALUES (?, ?);',
              [ingredients[i], recipe_id]);
          rows.push(row);
        } else {
          [row] = await promisePool.execute(
              'INSERT INTO ingredient (content, recipe_id, previous) VALUES (?, ?, ?);',
              [ingredients[i], recipe_id, previous]);
          rows.push(row);
        }

        previous = row.insertId;
      }
    } else {
      [row] = await promisePool.execute(
          'INSERT INTO ingredient (content, recipe_id) VALUES (?, ?);',
          [ingredients, recipe_id]);
      rows.push(row);
    }

    return rows;
  } catch (e) {
    console.error('addIngredient error', e.message);
    next(httpError('Database error', 500));
  }
};

module.exports = {
  addIngredient,
};