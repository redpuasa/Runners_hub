const mongoose = require("mongoose");
const OpenOrderSchema = new mongoose.Schema({
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
        type: String,
        possibleValues: ['Paid','Not Paid(Paid by Runner)','Not Paid(Paid Later)']
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
    }
});

const Open_Order = mongoose.model("Open_Order", OpenOrderSchema);
//export the schema
module.exports = Open_Order;