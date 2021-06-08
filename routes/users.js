const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Runner = require('../models/runners');
const openOrder = require('../models/open_order');
const privateOrder = require('../models/private_order');

let runnerList = [];
let orderList = [];
let privateList = [];
let currentUser = {};
let currentRunner = {};

router.post('/dashboard', (req, res) => {
    let success = false;
    runnerList = [];
    orderList = [];
    openOrder.find({}, function(err, orders) {
        orders.forEach(function(order) {
            orderList.push(order);
        })
    });
    Runner.find({}, function(err, runners) {
        runners.forEach(function(runner) {
            runnerList.push(runner);
        })
        User.find({}, function(err, users) {
        users.forEach(function(user) {
            if (user.Email === req.body.email && user.Password === req.body.password) {
                currentUser = user;
                res.render('user', {
                    title: "User page",
                    username: user.Username,
                    email: user.Email,
                    address: user.Address,
                    phone: user.Phone,
                    runners: runnerList
                });
                success = true;
            }
        });
        Runner.find({}, function(err, runners) {
        runners.forEach(function(runner) {
            if (runner.Email === req.body.email && runner.Password === req.body.password) {
                res.render('runner', {
                    title: "Runner page",
                    username: runner.Username,
                    email: runner.Email,
                    phone: runner.Phone,
                    payment: runner.Payment,
                    organization: runner.Organization,
                    orders: orderList
                });
                privateOrder.find({'Status': "Active", 'Runner' : runner.Username}, function(err, orders) {
                    orders.forEach(function(order) {
                        todoList.push(order);
                    })

                });
                privateOrder.find({'Runner' : runner.Username}, function(err, orders) {
                    orders.forEach(function(order) {
                        privateList.push(order);
                    })
                    res.render('runner', {
                        title: "Runner page",
                        username: runner.Username,
                        email: runner.Email,
                        phone: runner.Phone,
                        organization: runner.Organization,
                        payment: runner.Payment,
                        orders: orderList,
                        privates: privateList
                    });
                });
                
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
    })
})

router.post('/validation', (req, res) => {  
    req.body.phone = req.body.code + req.body.phone
    /*const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
        for (let i = 0; i < 25; i++) {
            token += characters[Math.floor(Math.random() * characters.length )];
        }*/
    let user = new User({
        Email: req.body.email,
        Username: req.body.username,
        Password: req.body.password,
        Address: req.body.address,
        Phone: req.body.phone,
        Status: req.body.status,
        //Verification_Code: token,
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

router.post('/postrequest', (req, res) => {
    let order = new openOrder({
        Username: req.body.username,
        Deli_date: req.body.deli_date,
        Deli_time: req.body.deli_time,
        Pickup_address: req.body.Pickup_Address,
        Delivery_address: req.body.Delivery_Address,
        Item_stat: req.body.item_stat,
        Phone: req.body.phone,
        Message: req.body.message,
        Status: req.body.orderStatus
    });
    order.save(function (err) {
    if (err) {
        res.render('error', {
            title: 'Error page',
            head: err.name,
            message: err,
            href: "/dashboard"
        });
    } else {
        res.render('user', {
            title: 'User page',
            username: currentUser.Username,
            email: currentUser.Email,
            address: currentUser.Address,
            phone: currentUser.Phone,
            runners: runnerList
        });
    }
    });
})

router.post('/postprivate', (req, res) => {
    let privateorder = new privateOrder({
        Username: req.body.username,
        Deli_date: req.body.deli_date,
        Deli_time: req.body.deli_time,
        Pickup_address: req.body.Pickup_Address,
        Delivery_address: req.body.Delivery_Address,
        Item_stat: req.body.item_stat,
        Phone: req.body.phone,
        Message: req.body.message,
        Runner: req.body.orderRunner
    });
    privateorder.save(function (err) {
    if (err) {
        res.render('error', {
            title: 'Error page',
            head: err.name,
            message: err,
            href: "/dashboard"
        });
    } else {
        res.render('user', {
            title: 'User page',
            username: currentUser.Username,
            email: currentUser.Email,
            address: currentUser.Address,
            phone: currentUser.Phone,
            runners: runnerList
        });
    }
    });
});

router.post('/acceptorder', (req, res) => {
    let query = {'_id' : req.body.DeliveryID};
    let newUpdate = {$set: {'Status' : "Active", 'Runner': req.body.orderRunner}}
    openOrder.updateOne(query, newUpdate, function(err, res) {
        if (err) throw err;
    });
    orderList = [];
    openOrder.find({}, function(err, orders) {
        orders.forEach(function(order) {
            if (order.Status === "Open") {
                orderList.push(order);
            }
        })
        openOrder.find({'Runner' : currentRunner.Username}, function(err, orders) {
            orders.forEach(function(order, index) {
                if (!(orders[index]._id === order._id)) {
                    if (index === orders.length - 1) {
                        todoList.push(order);
                    }
                }
            })
        });
        res.render('runner', {
            title: "Runner page",
            username: currentRunner.Username,
            email: currentRunner.Email,
            phone: currentRunner.Phone,
            organization: currentRunner.Organization,
            payment: currentRunner.Payment,
            orders: orderList,
            privates: privateList,
            todo: todoList
        });
    });
})

router.post('/acceptprivate', (req, res) => {
    let query = {'_id' : req.body.DeliveryID};
    let newUpdate = {$set: {'Status' : "Active"}}
    privateOrder.updateOne(query, newUpdate, function(err, res) {
        if (err) throw err;
    });
    privateList = [];
    privateOrder.find({}, function(err, orders) {
        orders.forEach(function(order) {
            if (order.Status === "Pending") {
                privateList.push(order);
            }
        })
        privateOrder.find({'Runner' : currentRunner.Username}, function(err, orders) {
            orders.forEach(function(order, index) {
                if (!(orders[index]._id === order._id)) {
                    if (index === orders.length - 1) {
                        todoList.push(order);
                    }
                }
            })
        });
        res.render('runner', {
            title: "Runner page",
            username: currentRunner.Username,
            email: currentRunner.Email,
            phone: currentRunner.Phone,
            organization: currentRunner.Organization,
            payment: currentRunner.Payment,
            orders: orderList,
            privates: privateList,
            todo: todoList
        });
    });
})

module.exports = router;