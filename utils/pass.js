'use strict';
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const bcrypt = require('bcryptjs');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const {getUserLogin} = require('../models/userModel');

// local strategy for username password login
passport.use(new Strategy(
    async (username, password, done) => {
      const params = [username];
      try {
        const [user] = await getUserLogin(params);
        console.log('Local strategy', user); // result is binary row

        if (!user) {
          return done(null, false, {message: 'Incorrect email.'});
        }

        /*
        if (password !== user.password) { // passwords dont match
          console.log('here');
          return done(null, false);
        }*/

        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, {message: 'Incorrect password.'});
        }

        return done(null, {...user}, {message: 'Logged In Successfully'}); // use spread syntax to create shallow copy to get rid of binary row type
      } catch (err) {
        return done(err);
      }
    }));

passport.use(
    new JWTStrategy(
        {
          jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
          secretOrKey: process.env.JWT_SECRET,
        },
        (jwtPayload, done) => {
          console.log('payload', jwtPayload);
          done(null, jwtPayload);
        },
    ),
);

module.exports = passport;