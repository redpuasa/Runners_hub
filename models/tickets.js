const mongoose = require("mongoose");
const TicketSchema = new mongoose.Schema({
	Subject: {
        type: String
    },
    Name: {
        type: String,
        required: true,
        trim: true
    },
    Phone: {
    	type: Number,
        required: true,
        trim: true
    },
    Message: {
    	type: String,
        required: true
    }
})

const Ticket = mongoose.model("Ticket", TicketSchema);

module.exports = Ticket;