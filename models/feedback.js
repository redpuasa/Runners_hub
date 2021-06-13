const mongoose = require("mongoose");
const FeedbackSchema = new mongoose.Schema({
    User: {
        type: String,
        required: true,
        trim: true
    },
    Runner: {
        type: String,
        required: true,
        trim: true
    },
    Message: {
    	type: String,
        required: true
    }
})

const Feedback = mongoose.model("Feedback", FeedbackSchema);

module.exports = Feedback;