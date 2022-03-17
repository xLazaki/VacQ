const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');


//load env vars
dotenv.config({path:'./config/config.env'});

//Connect to database
connectDB();
//Route files
const app=express();
const hospitals = require ('./routes/hospitals');
const appointments = require('./routes/appointments');
const auth= require ('./routes/auth');

//Body parser
app.use(express.json());
app.use('/api/v1/hospitals',hospitals);
app.use('/api/v1/auth',auth);
app.use('/api/v1/appointments', appointments);

//Cookie parser
app.use(cookieParser());

const PORT=process.env.PORT || 3000;

const server = app.listen(PORT,console.log('Server running in ', process.env.NODE_ENV,' mode on port ', PORT));

process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`);
    //close server & exit process
    server.close(()=>process.exit(1));
});