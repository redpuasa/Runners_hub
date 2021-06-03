const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Runner = require('../models/runners');

router.post('/dashboard', (req, res) => {
    let success = false;
    User.find({}, function(err, users) {
        users.forEach(function(user) {
            if (user._id === req.body.email && user.Password === req.body.password) {
                res.render('user', {title: "User page", username: user.Username});
                success = true;
            }
        });
    })
    Runner.find({}, function(err, runners) {
        runners.forEach(function(runner) {
            if (runner.Email === req.body.email && runner.Password === req.body.password) {
                res.render('runner', {title: "Runner page", username: runner.Username});
                success = true
            }
        });
        if (!success) {
            res.render('error', {
                title: 'Error page',
                head: 'Unsuccessful login',
                message: 'Incorrect email or password',
                href: "login"
            });
        }
    })
})

router.post('/validation', (req, res) => {  
    req.body.phone = req.body.code + req.body.phone
    let user = new User({
        _id: req.body.email,
        Username: req.body.username,
        Password: req.body.password,
        Address: req.body.address,
        Phone: req.body.phone,
        Status: req.body.status
    });
    user.save(function (err) {
    if (err) {
    	if (err.name === "MongoError" && err.code === 11000) {
    		res.render('error', {
    			title: 'Error page',
                head: 'Username already exist',
                message: 'Please use a different username',
    			href: "signup_user"
    		});
    	}
    } else {
    	res.render('validation', {title: 'Validation page'});
    }
    });
})

router.post('/runner-validation', (req, res) => {
    req.body.phone = req.body.code + req.body.phone
    let runner = new Runner({
        Username: req.body.username,
        Password: req.body.password,
        Email: req.body.email,
        Phone: req.body.phone,
        Organization: req.body.radioComp,
        Payment: req.body.radioPayment
    });
    runner.save(function (err) {
    if (err) {
    	if (err.name === "MongoError" && err.code === 11000) {
    		res.render('error', {
    			title: 'Error page',
                head: 'Username already exist',
                message: 'Please use a different username',
    			href: "signup_runner"
    		});
    	}
    } else {
    	res.render('validation', {title: 'Validation page'});
    }
	});
})

module.exports = router;