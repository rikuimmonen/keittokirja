const pool = require('../database/db');
const promisePool = pool.promise();
const {httpError} = require('../utils/errors');

const getAllUsers = async (next) => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT user_id, name, email, role FROM wop_user');
    return rows;
  } catch (e) {
    console.error('getAllUsers error', e.message);
    next(httpError('Database error', 500));
  }
};

const getUser = async (id, next) => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT id, name, email, role FROM user WHERE id = ?',
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
    // next(httpError('Database error', 500));
  }
};

module.exports = {
  getAllUsers,
  getUser,
  addUser,
  getUserLogin,
};
