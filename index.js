// Imports
const express = require('express')
//const expressLayouts = require('express-ejs-layouts')
const app = express()
const routes = require('./routes/app');
//const port = 3000
const mongoose = require("mongoose");

const db = require("./config/keys").MongoURI;
mongoose.connect(db, { newURLParser: true})
.then(console.log("MongoDB connected"))
.catch(err => console.log(err));

app.use(express.urlencoded({extended:true}));

// Static Files
app.use(express.static('public'))
// Example for other folders - not required
// app.use('/css', express.static(__dirname + 'public/css'))

// Set Templating Engine
//app.use(expressLayouts)
app.set('view engine', 'ejs')
//app.set('layout', 'index')

// Routes
app.use("/", routes);

// Listen on Port 5000
//app.listen(port, () => console.info(`App listening on port ${port}`))

// Establishing the port 
const PORT = process.env.PORT || 5000;
  
// Executing the sever on given port number
app.listen(PORT, console.log(`Server started on port ${PORT}`));
