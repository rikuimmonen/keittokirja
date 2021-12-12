'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();
const {httpError} = require('../utils/errors');

const addDirection = async (directions, recipe_id, next) => {
  try {
    let rows = [];
    let row;
    let previous;

    if (Array.isArray(directions)) {
      for (let i = 0; i < directions.length; i++) {
        if (i === 0) {
          [row] = await promisePool.execute(
              'INSERT INTO direction (content, recipe_id) VALUES (?, ?);',
              [directions[i], recipe_id]);
          rows.push(row);
        } else {
          [row] = await promisePool.execute(
              'INSERT INTO direction (content, recipe_id, previous) VALUES (?, ?, ?);',
              [directions[i], recipe_id, previous]);
          rows.push(row);
        }

        previous = row.insertId;
      }
    } else {
      [row] = await promisePool.execute(
          'INSERT INTO direction (content, recipe_id) VALUES (?, ?);',
          [directions, recipe_id]);
      rows.push(row);
    }

    return rows;
  } catch (e) {
    console.error('addDirection error', e.message);
    next(httpError('Database error', 500));
  }
};

module.exports = {
  addDirection,
};