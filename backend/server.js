require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const workoutRoutes = require('./routes/workouts');
const userRoutes = require('./routes/user');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use('/api/workouts', workoutRoutes);
app.use('/api/user', userRoutes);

//connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //listen to db
    app.listen(process.env.PORT, () => {
      console.log('connected to db and listening to port ', process.env.PORT);
    });
  })
  .catch((error) => console.log(error));
