'use strict';

const express = require('express');
const cors = require('cors');

const recipeRoute = require('./routes/recipeRoute');
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');

const passport = require('./utils/pass');

const {httpError} = require('./utils/errors');
const https = require('https');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('./uploads/'));
app.use('/thumbnails', express.static('thumbnails'));
app.use('/img', express.static('img'));
app.use(passport.initialize());

const sslkey  = fs.readFileSync('/etc/pki/tls/private/ca.key');
const sslcert = fs.readFileSync('/etc/pki/tls/certs/ca.crt');
const options = {
  key: sslkey,
  cert: sslcert
};

app.use('/auth', authRoute);
//app.use('/recipe', passport.authenticate('jwt', {session: false}), recipeRoute);
app.use('/recipe', recipeRoute);
//app.use('/user', passport.authenticate('jwt', {session: false}), userRoute);
app.use('/user', userRoute);

app.use((req, res, next) => {
  const err = httpError('Not found', 404);
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).
      json({message: err.message || 'internal server error'});
});

//app.listen(port, () => console.log(`Example app listening on port ${port}!`));
app.listen(3001); //normal http traffic
https.createServer(options, app).listen(8001); //https traffic
