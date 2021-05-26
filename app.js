// Imports
const express = require('express')
//const expressLayouts = require('express-ejs-layouts')
const app = express()
//const port = 3000

// Static Files
app.use(express.static('public'))
// Example for other folders - not required
// app.use('/css', express.static(__dirname + 'public/css'))

// Set Templating Engine
//app.use(expressLayouts)
app.set('view engine', 'ejs')
//app.set('layout', 'index')

// Routes
app.get('/', (req, res) => {
    res.render('index', {title: 'Runners Hub'})
})

app.get('/runner', (req, res) => {
    res.render('runner', {title: 'Runner page'})
})

app.get('/user', (req, res) => {
    res.render('user', {title: 'User page'})
})

app.get('/login', (req, res) => {
    res.render('login', {title: 'Login page'})      
})

app.get('/signup_runner', (req, res) => {
    res.render('signup_runner', {title: 'Runner Registration'})
})

app.get('/signup_user', (req, res) => {
    res.render('signup_user', {title: 'User Registration'})
})

app.get('/validation', (req, res) => {
    res.render('validation', {title: 'Validation page'})
})

// Listen on Port 5000
//app.listen(port, () => console.info(`App listening on port ${port}`))

// Establishing the port 
const PORT = process.env.PORT || 5000;
  
// Executing the sever on given port number
app.listen(PORT, console.log(`Server started on port ${PORT}`));
