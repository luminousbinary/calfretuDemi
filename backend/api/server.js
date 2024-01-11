var express = require ('express')
require("dotenv").config();
var path = require ('path')
const mongoose = require('mongoose');
const cors = require("cors");
var bodyParser = require('body-parser')
var session = require('express-session')
const mongoDBStore =require("connect-mongo")
const database = require('../config/database');
const mysql = require("mysql")
// va = require('express-validator')
// ...rest of the initial code omitted for simplicity.
const { body, validationResult } = require('express-validator');
const { MONGO_DB, NODE_ENV, ORIGIN, COOKIES_SECRET } = require('../config/config');


// console.log(MONGO_DB);
// //connect to database
// mongoose.set('strictQuery', false);
// mongoose.connect(MONGO_DB).then(() => console.log('Connected to database!'));;

// // mongo store 
// const store = new mongoDBStore({
//   mongoUrl:MONGO_DB,
//   ttl:20000, 
// })

// sSetting up a mysql db 
const db_con = mysql.createConnection({
  host: "localhost",
    user: "root",
    password: ''
})

db_con.connect((err)=>{
  if (err){
    console.log("Db is not connected");
  }else { console.log("DB succesfully connected...");}
})

// init app
var app = express()

// view engine setup
app.set('views',path.join(__dirname,'../../frontend', "views"))
app.set('view engine','ejs')
app.use(cors({
  credentials: true,
  origin: ORIGIN,
  optionsSuccessStatus: 200,
}));

/// // // to log inside consol dev environment /// /// 
if (NODE_ENV === "development") {
  const morgan = require("morgan")
  app.use(morgan("dev"))
}


// bodyParser middleware
app.use(bodyParser.json())
app.use (bodyParser.urlencoded({extended: true}));


// set[ublic folder]
app.use(express.static(path.join(__dirname, '../../frontend/public')));


// set routers
var pages = require('../routes/pages.js')
var adminPages = require('../routes/adminPage.js');
app.use('/', pages)
app.use('/admin/', adminPages)

// express session middleware
app.use(session({
    secret: COOKIES_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure:true, httpOnly:true, signed:true, maxAge:20000} ,
    // store: store,
}))

// // express validation 
// app.use(validationResult({
//     errorFormartter: function(params, msg, value){
//         var namespace = params.split('.'),
//         root = namespace.shift(),
//         formParam = root;
//     while(namespace.length) {
//         formParam += '['+ namespace.shift() + ']' 
//     }
//     return{
//         param : formParam,
//         msg: msg,
//         value: value
//     }
// }
// }))

/// /// index route /// /// //
app.get("/", (req, res) => {
  res.status(200).json({
      type: "success",
      message: "Server is up and running",
      data: null,
  })
});

app.get("/databsecreation", (req, res)=>{
  const databaseName = "econDB";

  const CreateQuery = `CREATE DATABASE ${databaseName}`

  db_con.query(CreateQuery, (err)=>{
    console.log("1");
    if (err) throw err;

    console.log("Db created succesfully");

    const usezQuery = `USE ${databaseName}`

    db_con.query(usezQuery, (err)=>{
      if (err) throw err
      console.log('Useing Database');
      

      return res.send("Created ans useing DB"+ `${databaseName}`)
    })
    

  })
})


// app.post(
//   '/user',
//   // username must be an email
//   body('username').isEmail(),
//   // password must be at least 5 chars long
//   body('password').isLength({ min: 5 }),
//   (req, res) => {
//     // Finds the validation errors in this request and wraps them in an object with handy functions
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     User.create({
//       username: req.body.username,
//       password: req.body.password,
//     }).then(user => res.json(user));
//   },
// );

// express message mid-ware
app.use(require('connect-flash')())
app.use(function(req,res,next){
    res.locals.messages = require('express-messages')(req,res)
    next()
}) 

module.exports = app