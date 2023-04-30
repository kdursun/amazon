require('dotenv').config();
const express = require('express');
const port = process.env.Port || 3001;
const mongoose = require('mongoose');
const seedRouter = require('./routes/seedRoute');
const productRouter = require('./routes/productRoute');
const userRouter = require('./routes/userRoute');
const orderRouter = require('./routes/orderRoute');
const uploadRouter = require('./routes/uploadRoute');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/seed', seedRouter);
app.use('/api/product', productRouter);
app.use('/api/user', userRouter);
app.use('/api/order', orderRouter);
app.use('/api/upload', uploadRouter);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('connected MongoDb Database');
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
