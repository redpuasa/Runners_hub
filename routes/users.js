const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Runner = require('../models/runners');
const openOrder = require('../models/open_order');
const privateOrder = require('../models/private_order');

let runnerList = [];
let orderList = [];
let privateList = [];
let todoList = [];
let activeList = [];
let currentUser = {};
let currentRunner = {};

router.post('/dashboard', (req, res) => {
    if (req.body.formMethod === "Login") {
        let success = false;
        runnerList = [];
        orderList = [];
        privateList = [];
        todoList = [];
        activeList = [];
        openOrder.find({}, function(err, orders) {
            orders.forEach(function(order) {
                if (order.Status === "Open") {
                    orderList.push(order);
                }
            })
        });
        Runner.find({}, function(err, runners) {
            runners.forEach(function(runner) {
                runnerList.push(runner);
            })
            User.find({}, function(err, users) {
            users.forEach(function(user) {
                if (user.Email === req.body.email && user.Password === req.body.password) {
                    openOrder.find({}, function(err, orders) {
                        orders.forEach(function(order) {
                            if (order.Status === "Active" && user.Username === order.Username) {
                                activeList.push(order);
                            }
                        })
                        privateOrder.find({}, function(err, orders) {
                            orders.forEach(function(order) {
                                if (order.Status === "Active" && user.Username === order.Username) {
                                    activeList.push(order);
                                }
                            })
                            res.render('user', {
                                title: "User page",
                                username: user.Username,
                                email: user.Email,
                                address: user.Address,
                                phone: user.Phone,
                                runners: runnerList,
                                actives: activeList
                            });
                        });
                        currentUser = user;
                        success = true;
                    });
                    
                    
                }
            });
            Runner.find({}, function(err, runners) {
            runners.forEach(function(runner) {
                if (runner.Email === req.body.email && runner.Password === req.body.password) {
                    currentRunner = runner;
                    openOrder.find({'Runner' : runner.Username}, function(err, orders) {
                        orders.forEach(function(order) {
                            todoList.push(order);
                        })
                    });
                    privateOrder.find({'Status': "Active", 'Runner' : runner.Username}, function(err, orders) {
                        orders.forEach(function(order) {
                            todoList.push(order);
                        })
                    });
                    privateOrder.find({'Runner' : runner.Username}, function(err, orders) {
                        orders.forEach(function(order) {
                            if (order.Status === "Pending") {
                                privateList.push(order);
                            }
                        })
                        setTimeout(function() {
                            res.render('runner', {
                                title: "Runner page",
                                username: runner.Username,
                                email: runner.Email,
                                phone: runner.Phone,
                                organization: runner.Organization,
                                payment: runner.Payment,
                                orders: orderList,
                                privates: privateList,
                                todo: todoList
                            });
                        }, 200);
                    });
                    
                    success = true
                }
            });
            setTimeout(function() {
                if (!success) {
                    res.render('error', {
                        title: 'Error page',
                        head: 'Unsuccessful login',
                        message: 'Incorrect email or password',
                        href: "login"
                    });
                }
            }, 200);
        })

        })
        })

    } else if (req.body.formMethod === "openRequest") {
        postRequest(req, res);
    } else if (req.body.formMethod === "privateRequest") {
        postPrivate(req, res);
    } else if (req.body.formMethod === "openAccept") {
        acceptOrder(req, res);
    } else if (req.body.formMethod === "privateAccept") {
        acceptPrivate(req, res);
    }
})

router.post('/validation', (req, res) => {  
    req.body.phone = req.body.code + req.body.phone
    let user = new User({
        Email: req.body.email,
        Username: req.body.username,
        Password: req.body.password,
        Address: req.body.address,
        Phone: req.body.phone,
        Status: req.body.status,
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

function postRequest(req, res) {
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
            runners: runnerList,
            actives: activeList
        });
    }
    });
}

function postPrivate(req, res) {
    let privateorder = new privateOrder({
        Username: req.body.username,
        Deli_date: req.body.deli_date,
        Deli_time: req.body.deli_time,
        Pickup_address: req.body.Pickup_Address,
        Delivery_address: req.body.Delivery_Address,
        Item_stat: req.body.item_stat,
        Phone: req.body.phone,
        Message: req.body.message,
        Status: req.body.orderStatus,
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
            runners: runnerList,
            actives: activeList
        });
    }
    });
}

function acceptOrder(req, res) {
    let query = {'_id' : req.body.DeliveryID};
    let newUpdate = {$set: {'Status' : "Active", 'Runner': req.body.orderRunner}}
    openOrder.updateOne(query, newUpdate, function(err, res) {
        if (err) throw err;
    });
    orderList = [];
    
    todoList = [];
    openOrder.find({'Runner' : currentRunner.Username}, function(err, orders) {
        orders.forEach(function(order) {
            todoList.push(order);
        })
        privateOrder.find({'Status': "Active", 'Runner' : currentRunner.Username}, function(err, orders) {
            orders.forEach(function(order) {
                todoList.push(order);
            })
            openOrder.find({}, function(err, orders) {
                orders.forEach(function(order) {
                    if (order.Status === "Open") {
                        orderList.push(order);
                    }
                })
                setTimeout(function() {
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
                }, 200);
            });
        });
    }); 
}

function acceptPrivate(req, res) {
    let query = {'_id' : req.body.DeliveryID};
    let newUpdate = {$set: {'Status' : "Active"}}
    privateOrder.updateOne(query, newUpdate, function(err, res) {
        if (err) throw err;
    });
    privateList = [];
    todoList = [];
    openOrder.find({'Runner' : currentRunner.Username}, function(err, orders) {
        orders.forEach(function(order) {
            todoList.push(order);
        })
        privateOrder.find({'Status': "Active", 'Runner' : currentRunner.Username}, function(err, orders) {
            orders.forEach(function(order) {
                todoList.push(order);
            })
            privateOrder.find({}, function(err, orders) {
                orders.forEach(function(order) {
                    if (order.Status === "Pending") {
                        privateList.push(order);
                    }
                })
                setTimeout(function() {
                    
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
                }, 200);
            });
        });
    });
}


/*
router.get('edit_profile/:id', (req, res) => {
    User.findById(req.params.id, (err, doc) =>{
        if (!err) {
            res.render('editUserProfile', {
                title: "test page",
                user: doc,
            })
        }
    })
})

function updateUser(req, res){
    User.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, (err, doc) => {
        if (!err) {res.redirect('user', {title: "test page"}); }
        else{
            if (err.name == "error")
            handleValidationError(err, req.body);
            res.render('editUserProfile', {
                title: 'test page'
            })
        }
    })
}

router.post('/edit_profile', (req, res) => {
    updateUser(req, res);
});

/*
router.patch('/edit_profile', function(req, res) {
    let query = {'_id' : req.body.userid};
    let newUpdate = {$set: {fName: req.body.fName, lName: req.body.lName}};
    User.updateOne(query, newUpdate, function(err, res) {
        if (err) throw err;
    });
    res.render('user', {
        title: "User page",
        username: currentRunner.Username,
        email: currentRunner.Email,
        phone: currentRunner.Phone,
        fName: req.body.fName
    });
});
*/

module.exports = router;