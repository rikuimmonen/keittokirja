'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();
const {httpError} = require('../utils/errors');

const addDirection = async (directions, recipe_id, next) => {
  try {
    let rows = [];
    let row = '';

    if (!Array.isArray(directions)) {
      let direction = directions;
      directions = [];
      directions.push(direction);
    }

    for (let i = 0; i < directions.length; i++) {
      [row] = await promisePool.execute(
          'INSERT INTO direction (content, recipe_id) VALUES (?, ?);',
          [directions[i], recipe_id]);

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

const editDirection = async (directions, recipe_id, next) => {
  try {
    let rows = [];
    let row = '';

    if (!Array.isArray(directions)) {
      let direction = directions;
      directions = [];
      directions.push(direction);
    }

    let [directionIds] = await promisePool.execute(
        'SELECT id FROM direction WHERE recipe_id = ' + recipe_id + ';');

    for (let i = 0; i < directions.length; i++) {
      [row] = await promisePool.execute(
          'UPDATE direction SET content = ? WHERE id = ?;',
          [directions[i], directionIds[i].id]);

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
  getDirections,
  editDirection,
};