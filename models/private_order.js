const mongoose = require("mongoose");
const PrivateOrderSchema = new mongoose.Schema({
     Username:{
        type: String,
        lowercase: true,
        required: true,
        trim: true
    },
    Deli_date:{
        type: Date,
        default: Date.now,
        required: true
    },
    Deli_time:{
        //type: String,
        type: Date,
        default: Date.now,
        required: true
    },
    Pickup_address:{
        type: String,
        lowercase: true,
        required: true,
        trim: true
    },
    Delivery_address:{
        type: String,
        lowercase: true,
        required: true,
        trim: true
    },
    Item_stat:{
        type: String
    },
    Phone:{
        type: Number,
        required: true,
        trim: true
    },
    Message:{
        type: String,
        required: true
    },
    Status: {
        type: String
    },
    Runner: {
        type: String
    }
});

const Private_Order = mongoose.model("Private_Order", PrivateOrderSchema);
//export the schema
module.exports = Private_Order;