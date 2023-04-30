const express = require('express');
const seedRouter = express.Router();
const Product = require('../DbModels/product');
const User = require('../DbModels/user');
const data = require('../constant/data');

seedRouter.get('/', async (req, res) => {
  await Product.deleteMany({});
  const createdProduct = await Product.insertMany(data.products);
  await User.deleteMany({});
  const createdUser = await User.insertMany(data.users);
  res.send({ createdProduct, createdUser });
});

module.exports = seedRouter;
