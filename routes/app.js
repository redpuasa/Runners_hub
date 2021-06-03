const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Runner = require('../models/runners');
const { render } = require('ejs');

router.get('/', (req, res) => {
    res.render('index', {title: 'Runners Hub'})
})

router.get('/runner', (req, res) => {
    res.render('runner', {title: 'Runner page'})
})

router.get('/user', (req, res) => {
    res.render('user', {title: 'User page'})
})

router.get('/admin', (req, res) => {
    res.render('admin', {title: 'Admin page'})
})

router.get('/login', (req, res) => {
    res.render('login', {title: 'Login page'})
})

router.get('/signup_runner', (req, res) => {
    res.render('signup_runner', {title: 'Runner Registration'})
})

router.get('/signup_user', (req, res) => {
    res.render('signup_user', {title: 'User Registration'})
})

router.post('/validation', (req, res) => {  
    res.render('validation', {title: 'Validation page'});
    req.body.phone = req.body.code + req.body.phone
    let user = new User({
        Username: req.body.username,
        Password: req.body.password,
        Email: req.body.email,
        Address: req.body.address,
        Phone: req.body.phone,
        Status: req.body.status
    });
    user.save(function (err, user) {
    if (err) return console.error(err);
        console.log(user.Username + " saved to user collection.");
    });
})

router.post('/runner-validation', (req, res) => {
    res.render('validation', {title: 'Validation page'});
    req.body.phone = req.body.code + req.body.phone
    let runner = new Runner({
        Username: req.body.username,
        Password: req.body.password,
        Email: req.body.email,
        Phone: req.body.phone,
        Organization: req.body.radioComp,
        Payment: req.body.radioPayment
    });
    runner.save(function (err, runner) {
    if (err) return console.error(err);
        console.log(runner.Username + " saved to runner collection.");
    });
})


module.exports = router;