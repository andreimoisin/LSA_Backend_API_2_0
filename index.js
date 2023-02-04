const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { useTreblle } = require("treblle");


//Import Routes
const authRoute = require('./routes/auth');
const usersDataRoute = require('./routes/usersData');

dotenv.config();

//Middleware
app.use(express.json());

//Connect to DB
mongoose.connect(
    process.env.DB_CONNECT, 
    {useNewUrlParser: true},
    () => console.log('connected to db!')
);

//Connect to Treblle
useTreblle(app, {
    apiKey: "_TREBLLE_API_KEY_",
    projectId: "_TREBLLE_PROJECT_ID_",
  });


//Adding cors
app.use(express.urlencoded({extended:true}));
app.use(cors());

//Routes Middlewares
app.use('/api/user', authRoute);
app.use('/api/user', usersDataRoute);

app.get('/', (req, res) => {
    res.send('Hello world');
})




app.listen(3000, () => console.log('Server Up and running'))