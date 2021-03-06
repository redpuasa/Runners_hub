const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Runner = require('../models/runners');
const openOrder = require('../models/open_order');
const privateOrder = require('../models/private_order');
const Notification = require('../models/notification');
const Feedback = require('../models/feedback');

let runnerList = [];
let orderList = [];
let privateList = [];
let todoList = [];
let activeList = [];
let notifyList = [];
let feedbackList = [];
let currentUser = {};
let currentRunner = {};
let ticketList = {};
let userList = {};

router.post('/dashboard', (req, res) => {
    /*if(req.body.username === "admin" && req.body.password === "admin"){
        user(req,res)
    }*/
    if (req.body.formMethod === "Login") {
        let success = false;
        runnerList = [];
        orderList = [];
        privateList = [];
        todoList = [];
        activeList = [];
        notifyList = [];
        feedbackList = [];
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
                    Notification.find({}, function(err, results) {
                        results.forEach(function(result) {
                            if (result.Username === user.Username && result.Status === "Sent") {
                                notifyList.push(result);
                            }
                        })
                    });
                    Feedback.find({}, function(err, feedbacks) {
                        feedbacks.forEach(function(feedback) {
                            feedbackList.push(feedback);
                        })
                    });
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
                                first: currentUser.fName,
                                last: currentUser.lName,
                                email: user.Email,
                                address: user.Address,
                                phone: user.Phone,
                                runners: runnerList,
                                actives: activeList,
                                notify: notifyList,
                                feedbacks: feedbackList
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
                    openOrder.find({'Status': "Active", 'Runner' : runner.Username}, function(err, orders) {
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
                                first: currentRunner.fName,
                                last: currentRunner.lName,
                                email: runner.Email,
                                phone: runner.Phone,
                                organization: runner.Organization,
                                payment: runner.Payment,
                                brunei: currentRunner.brunei,
                                temburong: currentRunner.temburong,
                                tutong: currentRunner.tutong,
                                seria: currentRunner.seria,
                                kb: currentRunner.kb,
                                outside: currentRunner.outside,
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
    } else if (req.body.formMethod === "privateDecline") {
        declinePrivate(req, res);
    } else if (req.body.formMethod === "jobComplete") {
        completeJob(req, res, "Complete");
    } else if (req.body.formMethod === "jobRemove") {
        completeJob(req, res, "Cancel");
    } else if (req.body.formMethod === "todoUpdate") {
        updateTodo(req, res);
    } else if (req.body.formMethod === "notifyRemove") {
        removeNotify(req, res);
    } else if (req.body.formMethod === "feedbackRunner") {
        userFeedback(req, res);
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
            first: currentUser.fName,
            last: currentUser.lName,
            email: currentUser.Email,
            address: currentUser.Address,
            phone: currentUser.Phone,
            runners: runnerList,
            actives: activeList,
            notify: notifyList,
            feedbacks: feedbackList
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
            first: currentUser.fName,
            last: currentUser.lName,
            email: currentUser.Email,
            address: currentUser.Address,
            phone: currentUser.Phone,
            runners: runnerList,
            actives: activeList,
            notify: notifyList,
            feedbacks: feedbackList
        });
    }
    });
}

function acceptOrder(req, res) {
    orderList = [];
    todoList = [];
    let query = {'_id' : req.body.DeliveryID};
    let newUpdate = {$set: {'Status' : "Active", 'Runner': req.body.orderRunner, 'Deli_stat' : "Proceed to Pickup Address"}}
    openOrder.updateOne(query, newUpdate, function(err) {
        if (err) throw err;
        setTimeout(function() {
            openOrder.find({'Status': "Active", 'Runner' : currentRunner.Username}, function(err, orders) {
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
                        res.render('runner', {
                            title: "Runner page",
                            username: currentRunner.Username,
                            first: currentRunner.fName,
                            last: currentRunner.lName,
                            email: currentRunner.Email,
                            phone: currentRunner.Phone,
                            organization: currentRunner.Organization,
                            payment: currentRunner.Payment,
                            brunei: currentRunner.brunei,
                            temburong: currentRunner.temburong,
                            tutong: currentRunner.tutong,
                            seria: currentRunner.seria,
                            kb: currentRunner.kb,
                            outside: currentRunner.outside,
                            orders: orderList,
                            privates: privateList,
                            todo: todoList
                        });
                    });
                });
            });
        }, 200);
    });
    let date = new Date();
    let addnotify = new Notification({
        Username: req.body.orderUser,
        Message: "take on delivery",
        Date_now: date,
        Runner: currentRunner.Username,
        Order: req.body.DeliveryID,
        Status: "Sent",
    });
    addnotify.save(function (err) {
        if (err) throw err;
    });
}

function acceptPrivate(req, res) {
    privateList = [];
    todoList = [];
    let query = {'_id' : req.body.DeliveryID};
    let newUpdate = {$set: {'Status' : "Active", 'Deli_stat' : "Proceed to Pickup Address"}}
    privateOrder.updateOne(query, newUpdate, function(err) {
        if (err) throw err;
        setTimeout(function() {
            openOrder.find({'Status': "Active", 'Runner' : currentRunner.Username}, function(err, orders) {
                orders.forEach(function(order) {
                    todoList.push(order);
                })
                privateOrder.find({'Status': "Active", 'Runner' : currentRunner.Username}, function(err, orders) {
                    orders.forEach(function(order) {
                        todoList.push(order);
                    })
                    privateOrder.find({'Runner' : currentRunner.Username}, function(err, orders) {
                        orders.forEach(function(order) {
                            if (order.Status === "Pending") {
                                privateList.push(order);
                            }
                        })
                            res.render('runner', {
                                title: "Runner page",
                                username: currentRunner.Username,
                                first: currentRunner.fName,
                                last: currentRunner.lName,
                                email: currentRunner.Email,
                                phone: currentRunner.Phone,
                                organization: currentRunner.Organization,
                                payment: currentRunner.Payment,
                                brunei: currentRunner.brunei,
                                temburong: currentRunner.temburong,
                                tutong: currentRunner.tutong,
                                seria: currentRunner.seria,
                                kb: currentRunner.kb,
                                outside: currentRunner.outside,
                                orders: orderList,
                                privates: privateList,
                                todo: todoList
                            });
                    });
                });
            });
        }, 200);
    });
    let date = new Date();
    let addnotify = new Notification({
        Username: req.body.orderUser,
        Message: "accept personal request",
        Date_now: date,
        Runner: currentRunner.Username,
        Order: req.body.DeliveryID,
        Status: "Sent",
    });
    addnotify.save(function (err) {
        if (err) throw err;
    });
}

function declinePrivate(req, res) {
    privateList = [];
    let query = {'_id' : req.body.DeliveryID};
    let newUpdate = {$set: {'Status' : "Decline"}}
    privateOrder.updateOne(query, newUpdate, function(err) {
        if (err) throw err;
        privateOrder.find({'Runner' : currentRunner.Username}, function(err, orders) {
            orders.forEach(function(order) {
                if (order.Status === "Pending") {
                    privateList.push(order);
                }
            })
                res.render('runner', {
                    title: "Runner page",
                    username: currentRunner.Username,
                    first: currentRunner.fName,
                    last: currentRunner.lName,
                    email: currentRunner.Email,
                    phone: currentRunner.Phone,
                    organization: currentRunner.Organization,
                    payment: currentRunner.Payment,
                    brunei: currentRunner.brunei,
                    temburong: currentRunner.temburong,
                    tutong: currentRunner.tutong,
                    seria: currentRunner.seria,
                    kb: currentRunner.kb,
                    outside: currentRunner.outside,
                    orders: orderList,
                    privates: privateList,
                    todo: todoList
                });
        });
    })
    let date = new Date();
    let addnotify = new Notification({
        Username: req.body.orderUser,
        Message: "decline personal request",
        Date_now: date,
        Runner: currentRunner.Username,
        Order: req.body.DeliveryID,
        Status: "Sent",
    });
    addnotify.save(function (err) {
        if (err) throw err;
    });
}

function completeJob(req, res, status) {
    todoList = [];
    let query = {'_id' : req.body.DeliveryID};
    let newUpdate = {$set: {'Status' : status}};
    privateOrder.find(query, function(err, result) {
        if (!(result.length === 0)) {
            privateOrder.updateOne(query, newUpdate, function(err) {
                todoJobRemove(req, res, status);
            });
        }
    })
    openOrder.find(query, function(err, result) {
        if (!(result.length === 0)) {
            openOrder.updateOne(query, newUpdate, function(err) {
                todoJobRemove(req, res, status);
            });
        }
    })
}

function todoJobRemove(req, res, status) {
    openOrder.find({'Status': "Active", 'Runner' : currentRunner.Username}, function(err, orders) {
        orders.forEach(function(order) {
            todoList.push(order);
        })
        privateOrder.find({'Status': "Active", 'Runner' : currentRunner.Username}, function(err, orders) {
            orders.forEach(function(order) {
                todoList.push(order);
            })
            res.render('runner', {
                title: "Runner page",
                username: currentRunner.Username,
                first: currentRunner.fName,
                last: currentRunner.lName,
                email: currentRunner.Email,
                phone: currentRunner.Phone,
                organization: currentRunner.Organization,
                payment: currentRunner.Payment,
                brunei: currentRunner.brunei,
                temburong: currentRunner.temburong,
                tutong: currentRunner.tutong,
                seria: currentRunner.seria,
                kb: currentRunner.kb,
                outside: currentRunner.outside,
                orders: orderList,
                privates: privateList,
                todo: todoList
            });
        })
    })
    if (status === "Complete") {
        let date = new Date();
        let addnotify = new Notification({
            Username: req.body.orderUser,
            Message: "complete delivery",
            Date_now: date,
            Runner: currentRunner.Username,
            Order: req.body.DeliveryID,
            Status: "Sent",
        });
        addnotify.save(function (err) {
            if (err) throw err;
        });
    } else if (status === "Cancel") {
        let date = new Date();
        let addnotify = new Notification({
            Username: req.body.orderUser,
            Message: "cancel delivery",
            Date_now: date,
            Runner: currentRunner.Username,
            Order: req.body.DeliveryID,
            Status: "Sent",
        });
        addnotify.save(function (err) {
            if (err) throw err;
        });
    }
    
}

function updateTodo(req, res) {
    let query = {'_id' : req.body.DeliveryID};
    let newUpdate = {$set: {'Deli_stat' : req.body.deli_stat}};
    privateOrder.find(query, function(err, result) {
        if (!(result.length === 0)) {
            privateOrder.updateOne(query, newUpdate, function(err) {
                res.render('runner', {
                    title: "Runner page",
                    username: currentRunner.Username,
                    first: currentRunner.fName,
                    last: currentRunner.lName,
                    email: currentRunner.Email,
                    phone: currentRunner.Phone,
                    organization: currentRunner.Organization,
                    payment: currentRunner.Payment,
                    brunei: currentRunner.brunei,
                    temburong: currentRunner.temburong,
                    tutong: currentRunner.tutong,
                    seria: currentRunner.seria,
                    kb: currentRunner.kb,
                    outside: currentRunner.outside,
                    orders: orderList,
                    privates: privateList,
                    todo: todoList
                });
            });
            let date = new Date();
            let addnotify = new Notification({
                Username: req.body.orderUser,
                Message: req.body.deli_stat,
                Date_now: date,
                Runner: currentRunner.Username,
                Order: req.body.DeliveryID,
                Status: "Sent",
            });
            addnotify.save(function (err) {
                if (err) throw err;
            });
        }
    })
    openOrder.find(query, function(err, result) {
        if (!(result.length === 0)) {
            openOrder.updateOne(query, newUpdate, function(err) {
                res.render('runner', {
                    title: "Runner page",
                    username: currentRunner.Username,
                    first: currentRunner.fName,
                    last: currentRunner.lName,
                    email: currentRunner.Email,
                    phone: currentRunner.Phone,
                    organization: currentRunner.Organization,
                    payment: currentRunner.Payment,
                    brunei: currentRunner.brunei,
                    temburong: currentRunner.temburong,
                    tutong: currentRunner.tutong,
                    seria: currentRunner.seria,
                    kb: currentRunner.kb,
                    outside: currentRunner.outside,
                    orders: orderList,
                    privates: privateList,
                    todo: todoList
                });
            });
            let date = new Date();
            let addnotify = new Notification({
                Username: req.body.orderUser,
                Message: req.body.deli_stat,
                Date_now: date,
                Runner: currentRunner.Username,
                Order: req.body.DeliveryID,
                Status: "Sent",
            });
            addnotify.save(function (err) {
                if (err) throw err;
            });
        }
    })
}

/*
function user(req, res){
    User.find({}, (err, users) => {
        users.forEach(function(user) {
            userList.push(user);
        })
    })
    res.render('admin', {
        title: 'Admin Page',
        runner: runnerList,
        user: userList,
    })
}
*/

function removeNotify(req, res) {
    notifyList = [];
    let query = {'_id' : req.body.DeliveryID};
    let newUpdate = {$set: {'Status' : "Removed"}};
    Notification.updateOne(query, newUpdate, function(err) {
        Notification.find({}, function(err, results) {
            results.forEach(function(result, index) {
                if (result.Username === currentUser.Username && result.Status === "Sent") {
                    notifyList.push(result);
                }
                if (index === (results.length - 1)) {
                    res.render('user', {
                        title: 'User page',
                        username: currentUser.Username,
                        first: currentUser.fName,
                        last: currentUser.lName,
                        email: currentUser.Email,
                        address: currentUser.Address,
                        phone: currentUser.Phone,
                        runners: runnerList,
                        actives: activeList,
                        notify: notifyList,
                        feedbacks: feedbackList
                    });
                }
            })
            
        });
    })
}

function userFeedback(req, res) {
    feedbackList = [];
    let addfeedback = new Feedback({
        User: req.body.notifyUser,
        Runner: req.body.notifyRunner,
        Message: req.body.feedback
    });
    addfeedback.save(function (err) {
        if (err) throw err;
        Feedback.find({}, function(err, feedbacks) {
            feedbacks.forEach(function(feedback) {
                feedbackList.push(feedback);
            })
            res.render('user', {
                title: 'User page',
                username: currentUser.Username,
                first: currentUser.fName,
                last: currentUser.lName,
                email: currentUser.Email,
                address: currentUser.Address,
                phone: currentUser.Phone,
                runners: runnerList,
                actives: activeList,
                notify: notifyList,
                feedbacks: feedbackList
            });
        });
    });
}

router.get('/edit_profile', (req, res) => {
    res.render('editUserProfile', {title: 'User Page'})
})

router.post('/updated', (req,res) => {
    const query = {"_id" : currentUser._id}
    const updateProfile = {$set:
         {
            fName: req.body.fName,
            lName: req.body.lName,
            phone: req.body.Phone,
            address: req.body.Address
        }}
    User.updateOne(query, updateProfile, {multi: true, rawResult: true}, (err, doc) => {
        if (err) return res.status(500, {error: err});
        return res.render('acc-update', {
            title: 'Account Updated', 
            username: currentUser.Username,
            first: currentUser.fName,
            last: currentUser.lName,
            email: currentUser.Email,
            phone: currentUser.Phone,
            address: currentUser.Address,
            runners: runnerList,
            actives: activeList
        }); 
    });
})

router.get('/edit-profile', (req, res) => {
    res.render('editRunnerProfile', {title: 'Runner Page'})
})

router.post('/updates', (req,res) => {
    const query = {"_id" : currentRunner._id};
    const updateProfile = {$set: {
        fName: req.body.fName, 
        lName: req.body.lName,
        phone: req.body.Phone,
        brunei: req.body.brunei,
        temburong: req.body.temburong,
        tutong: req.body.tutong,
        seria: req.body.seria,
        kb: req.body.kb,
        outside: req.body.outside,
    }}
    Runner.updateOne(query, updateProfile, {multi: true, rawResult: true}, (err, doc) => {
        if (err) return res.status(500, {error: err});
        return res.render('acc-update', {
            title: 'Account Updated', 
            username: currentRunner.Username,
            first: currentRunner.fName,
            last: currentRunner.lName,
            email: currentRunner.Email,
            phone: currentRunner.Phone,
            organization: currentRunner.Organization,
            payment: currentRunner.Payment,
            brunei: currentRunner.brunei,
            temburong: currentRunner.temburong,
            tutong: currentRunner.tutong,
            seria: currentRunner.seria,
            kb: currentRunner.kb,
            outside: currentRunner.outside,
            orders: orderList,
            privates: privateList,
            todo: todoList
        }); 
    });
})


module.exports = router;