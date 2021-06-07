const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Runner = require('../models/runners');
<<<<<<< Updated upstream
const openOrder = require('../models/open_order');
const privateOrder = require('../models/private_order');

let runnerList = [];
let orderList = [];
let currentUser = {};
=======
const PrivateOrder = require('../models/private_order');

>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
        Runner.find({}, function(err, runners) {
=======
    })

    Runner.find({}, function(err, runners) {
>>>>>>> Stashed changes
        runners.forEach(function(runner) {
            if (runner.Email === req.body.email && runner.Password === req.body.password) {
                
                res.render('runner', {
                    title: "Runner page",
                    username: runner.Username,
                    email: runner.Email,
                    phone: runner.Phone,
                    organization: runner.Organization,
                    payment: runner.Payment,
                    orders: orderList
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

<<<<<<< Updated upstream
    })
    })
=======
    //NOT SURE WITH THIS ONE
    /*
    PrivateOrder.find({}, function(err, private_order) {
        private_order.forEach(function(privatePost) {
            if (privatePost.Email === req.body.email && privatePost.Password === req.body.password) {
                res.render('privatePost', {title: "Private Request page", username: privatePost.Username});
                success = true;
            }
        });
    })
    */
    //NOT SURE WITH THIS ONE
>>>>>>> Stashed changes
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
    console.log({Username: req.body.username, Password: req.body.password})
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

<<<<<<< Updated upstream
router.post('/postrequest', (req, res) => {
    let order = new openOrder({
        Username: req.body.username,
        Deli_date: req.body.deli_date,
        Deli_time: req.body.deli_time,
        Pickup_address: req.body.Pickup_Address,
        Delivery_address: req.body.Delivery_Address,
        Item_stat: req.body.radioStatus,
        Phone: req.body.phone,
        Message: req.body.message,
        Status: req.body.orderStatus
    });
    order.save(function (err) {
    if (err) {
        res.render('error', {
            title: 'Error page',
            head: err.name,
            message: 'err.code',
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
        Item_stat: req.body.radioStatus,
        Phone: req.body.phone,
        Message: req.body.message,
        Status: req.body.orderStatus
    });
    privateorder.save(function (err) {
    if (err) {
        res.render('error', {
            title: 'Error page',
            head: err.name,
            message: 'err.code',
            href: "/dashboard"
        });
    } else {
        res.render('user', {title: 'User page'});
    }
    });
})
=======
//USER POST NEW PRIVATE REQUEST 
router.post('/privateOrder', (req, res) => {  
    req.body.phone = req.body.code + req.body.phone
    let privatePost = new Private_Order ({
        Username: req.body.username,
        Deli_date: req.body.deli_date,
        Deli_time: req.body.deli_time,
        Pickup_address: req.body.pickup_address,
        Delivery_address: req.body.deli_address,
        Item_stat: req.body.item_stat,
        Phone: req.body.phone,
        Message: req.body.message
    });

    console.log({Username: req.body.username})
    privatePost.save(function (err) {
    if (err) {
    	if (err.name === "MongoError" && err.code === 11000) {
    		res.render('error', {
    			title: 'Error page',
                message: 'Error 404',
    			href: "user_privateForm"
    		});
    	}
    } else {
    	res.render('user_profile', {title: 'Private Post Page'});
    }
    });
})
//USER POST NEW PRIVATE REQUEST 

//USER POST NEW OPEN REQUEST 
router.post('/user_profile', (req, res) => {  
    req.body.phone = req.body.code + req.body.phone
    let openPost = new Open_Order ({
        Username: req.body.username,
        Deli_date: req.body.deli_date,
        Deli_time: req.body.deli_time,
        Pickup_address: req.body.pickup_address,
        Delivery_address: req.body.deli_address,
        Item_stat: req.body.item_stat,
        Phone: req.body.phone,
        Message: req.body.message
    });

    console.log({Username: req.body.username})
    privatePost.save(function (err) {
    if (err) {
    	if (err.name === "MongoError" && err.code === 11000) {
    		res.render('error', {
    			title: 'Error page',
                message: 'Error 404',
    			href: "user_jobForm"
    		});
    	}
    } else {
    	res.render('user_profile', {title: 'Open Post Page'});
    }
    });
})
//USER POST NEW OPEN REQUEST 
>>>>>>> Stashed changes

module.exports = router;