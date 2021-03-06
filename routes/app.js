const express = require('express');
const router = express.Router();
const Ticket = require('../models/tickets');
const { render } = require('ejs');

router.get('/', (req, res) => {
    res.render('index', {title: 'Runners Hub'});
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

router.post('/ticket', (req, res) => {
    let ticket = new Ticket({
        Subject: req.body.subject,
        Name: req.body.name,
        Phone: req.body.phone,
        Message: req.body.message

    });
    ticket.save(function (err) {
    if (err) {
        res.render('error', {
            title: 'Error page',
            head: err.name,
            message: err,
            href: "/"
        });
    } else {
        res.render('index', {title: 'Runners Hub'});
    }
    });
})

//Runner signup
router.get('/signup_runner', (req, res) => {
    res.render('signup_runner', {title: 'Runner Registration'})
})

//User signup
router.get('/signup_user', (req, res) => {
    res.render('signup_user', {title: 'User Registration'})
})

//User send new private post
router.get('/user_privateForm', (req, res) => {
    res.render('user_privateForm', {title: 'Add Private Post'})
})

//User send new open post
router.get('/user_jobForm', (req, res) => {
    res.render('user_openForm', {title: 'Add Private Post'})
})

module.exports = router;