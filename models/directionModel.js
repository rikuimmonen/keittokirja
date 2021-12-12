'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();
const {httpError} = require('../utils/errors');

const addDirection = async (directions, recipe_id, next) => {
  try {
    let rows = [];
    let row = '';
    let previous;

    if (!Array.isArray(directions)) {
      [directions] = directions;
    }

    for (let i = 0; i < directions.length; i++) {
      if (i === 0) {
        [row] = await promisePool.execute(
            'INSERT INTO direction (content, recipe_id) VALUES (?, ?);',
            [directions[i], recipe_id]);
      } else {
        previous = row !== '' ? row.insertId : '';
        [row] = await promisePool.execute(
            'INSERT INTO direction (content, recipe_id, previous) VALUES (?, ?, ?);',
            [directions[i], recipe_id, previous]);
      }

      rows.push(row);
    }

    return rows;
  } catch (e) {
    console.error('addDirection error', e.message);
    next(httpError('Database error', 500));
  }
};

const getDirections = async (recipe_id, next) => {
  try {
    let directions = [];

    let [directionsRaw] = await promisePool.execute(
        'SELECT content FROM direction WHERE recipe_id = ' + recipe_id + ';');

    for (let j = 0; j < directionsRaw.length; j++) {
      directions[j] = directionsRaw[j].content;
    }

    return directions;
  } catch (e) {
    console.error('getDirections error', e.message);
    next(httpError('Database error', 500));
  }
};

module.exports = {
  addDirection,
  getDirections,
};