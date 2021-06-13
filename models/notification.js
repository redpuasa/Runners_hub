const mongoose = require("mongoose");
const NotifySchema = new mongoose.Schema({
	Username:{
        type: String,
        lowercase: true,
        required: true,
        trim: true
    },
    Message:{
        type: String,
        required: true
    },
    Date_now:{
        type: Date,
        required: true
    },
    Runner: {
        type: String
    },
    Order: {
        type: String
    },
    Status: {
        type: String
    }
});

const Notification = mongoose.model("Notification", NotifySchema);

module.exports = Notification;