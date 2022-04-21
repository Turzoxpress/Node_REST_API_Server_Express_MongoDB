![Alt Node.js Express MongoDB](/screenshots/node.gif "Node.js Express MongoDB")

## How to create REST API server with Node.js, Express Framwork & MongoDB database?
In this tutorial we will create a **Node.js** REST API server with **Express Framework** and **MongoDB** database. This tutorial will be covered based on Ubuntu 20 Operating System. <br>

![Alt Node.js Express MongoDB](/screenshots/nodejsExpressMongo.jpg "Node.js Express MongoDB")

### Installing **Node.js version 16** on  Ubuntu machine
```
sudo apt update
sudo apt upgrade

sudo apt install -y curl

curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -

```
* Check node is installed successfully.
```
node --version
```
> This command will show you the node version something like this **v16.1.0**

* Check npm version.
```
npm --version
```
> This command will show you the npm version something like this **v8.3.0**


* Create an empty folder or directory.
```
sudo mkdir test
cd test
```

* For creating new node project or app run the command below and complete all the steps.
```
npm init
```
1. package name : *node_express_test_server*
2. version : *keep it blank and press enter*
3. description : *keep it blank and press enter*
4. entry point : *keep it blank and press enter*
5. test command : *keep it blank and press enter*
6. git repository :  *keep it blank and press enter*
7. keywords :  *keep it blank and press enter*
8. author :  *keep it blank and press enter*
9. license :  *keep it blank and press enter*
> At the last step , the command prompt will ask you to confirm, type **y** or **yes**

### And, that's all! Your first node app created successfully!

![Alt Node.js Express MongoDB](/screenshots/s1.png "Node.js Express MongoDB")

* Now create a file named **app.js** in the main direcotry. You can use GUI to create this file also.
```
touch app.js
```

* Now install some packages to create complete REST api server including Express framework.

```
# Main REST API framework for Node
npm install express 

# Allow outside visitors to visit our server
npm install cors  

# Helps to connect MongoDB with Express framework
npm install mongoose 

# Helps to restart server, very handy in development mode
npm install nodemon 
```

* Go to **package.json** file and add your **app.js** file into start command.
```
...
"scripts": {
    "start": "nodemon app.js"
  },
...
```

![Alt Node.js Express MongoDB](/screenshots/s2.png "Node.js Express MongoDB")

* Create a directory named **db** and create a file named **database.js** in this **db** directory. Then paste the code below into **database.js** file. This file will help us to connect with our MongoDB database.
```
var mongoose = require('mongoose')

# Try with 127.0.0.1 if localhost do not work
mongoose.connect('mongodb://127.0.0.1:27017/node_express_db', {useNewUrlParser: true, useUnifiedTopology: true})

 
var conn = mongoose.connection
 
conn.on('connected', function() {
    console.log('database is connected successfully')
});
conn.on('disconnected',function(){
    console.log('database is disconnected successfully')
})
 
conn.on('error', console.error.bind(console, 'connection error:'))
 
module.exports = conn
```

* Create another directory named **models** and create a file named **userModel.js** & paste the code below.
```
var mongoose=require('mongoose')
var db = require('../db/database')
 
// create an schema
var userSchema = new mongoose.Schema({
            
            name:String,
            email: String,
            address: String,
            
        });

 
userTable=mongoose.model('users',userSchema, 'users')
         
module.exports = userTable
```

### As we have created our model, we can now proceed to create some test APIs.

* Open **app.js** file and add the code below.
```
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

```

* Now start the server.
```
npm start
```

### If you see something like below then congratulations! You are successfully running Node REST API server with Express framework and MongoDB database!
<br>

![Alt Node.js Express MongoDB](/screenshots/s3.png "Node.js Express MongoDB")

#### Now it's time to test our newly created APIs with Postman.

![Alt Node.js Express MongoDB](/screenshots/s4.png "Node.js Express MongoDB")
<br><br>

![Alt Node.js Express MongoDB](/screenshots/s5.png "Node.js Express MongoDB")
<br><br>

![Alt Node.js Express MongoDB](/screenshots/s6.png "Node.js Express MongoDB")



