// Imports
const express = require('express')
const app = express()
const routes = require('./routes/app');
const users = require('./routes/users');

app.use(express.urlencoded({extended:true}));
// Static Files
app.use(express.static('public'))
app.set('view engine', 'ejs')

//MongoDB Connection
const mongoose = require("mongoose");
const db = require("./config/keys").MongoURI;
mongoose.connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(console.log("MongoDB connected"))
.catch(err => console.log(err));

// Routes
app.use("/", routes);
app.use("/", users);

// Establishing the port 
const PORT = process.env.PORT || 5000;
// Executing the sever on given port number
app.listen(PORT, console.log(`Server started on port ${PORT}`));