// Imports
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const port = 3000

// Static Files
app.use(express.static('public'))
// Example for other folders - not required
// app.use('/css', express.static(__dirname + 'public/css'))

// Set Templating Engine
app.use(expressLayouts)
app.set('layout', './layout/runner')
app.set('view engine', 'ejs')

// Routes
app.get('', (req, res) => {
    res.render('runner', { title: 'Home Page'})
})

app.get('/user', (req, res) => {
    res.render('user', { title: 'About Page', layout: './layout/user' })
})

// Listen on Port 5000
//app.listen(port, () => console.info(`App listening on port ${port}`))

// Establishing the port 
const PORT = process.env.PORT ||5000;
  
// Executing the sever on given port number
app.listen(PORT, console.log(
  `Server started on port ${PORT}`));
