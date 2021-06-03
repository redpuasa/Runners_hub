const express = require('express');
const router = express.Router();
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

router.get('/signup_runner', (req, res) => {
    res.render('signup_runner', {title: 'Runner Registration'})
})

router.get('/signup_user', (req, res) => {
    res.render('signup_user', {title: 'User Registration'})
})

module.exports = router;