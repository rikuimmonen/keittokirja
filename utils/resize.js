'use strict';
const sharp = require('sharp');

const makeThumbnail = async (file, thumbname) => {
  // file = full path to image (req.file.path), thumbname = filename (req.file.filename)
  return await sharp(file).resize(160, 160).png().toFile(thumbname);
};

const makeBigImage = async (file, filename) => {
  return await sharp(file).resize(1200, 900).jpeg().toFile(filename);
};

const makeSmallImage = async (file, filename) => {
  return await sharp(file).resize(400, 300).jpeg().toFile(filename);
};

module.exports = {
  makeThumbnail,
  makeBigImage,
  makeSmallImage,
};