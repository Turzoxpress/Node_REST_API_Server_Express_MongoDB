const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
const port = 3000

/*
Set the cors option to access this server from outside of the world. Don't forget to limit this access when you are in production mode
*/

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));


/*
It will handle large amount of json body data to receive and transfer over request
*/
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: false, limit: '20mb' }))

//Our database connection helper
const dbConn = require('./db/database');

// Our user model
const userModel = require('./models/userModel');

//-- Welcome API, our first API
app.get('/welcome', (req, res) => {


  return res.json({ code: 200, message : "Congratulations! Your Node js REST API server with Express framework and MongoDB is ready!" });

});

//-- Create new user API
app.post('/createUser', async (req, res) => {

  if (!Object.keys(req.body).length) {
    return res.json({ status: 501, message: "No body provided" })
  }

  userModel.findOne({ email: req.body.email })
  .then((user) => {

    //------------ Checking user exists or not
    if (user) return res.json({ status: 401, data: "User already exists with this phone number" })

    //--- If user not created before, create now
    userModel.create(req.body)
    .then((result) => {

        return res.json({status : 200, message : "User created successfully", result : result})
    })
    .catch((err) => {
         return res.json({status : 501, message : "Something bad happened, Error : "+ err})
    })

  })
  .catch((err) => {
    return res.json({status : 501, message : "Something bad happened, Error : "+ err})
})


})

//-- Show all users
app.get("/getAllUsers", async (req, res) => {

    userModel.find()
    .then((result) => {
        return res.json({status : 200, result : result})
    })
    .catch((err) => {
        return res.json({status : 501, message : "Something bad happened, Error : "+ err})
   })
})

//start node server on 3000 port
app.listen(port, () => {
    console.log(`Server started successfully on port ${port}`)
  })