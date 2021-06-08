const mongoose = require("mongoose");
const RunnerSchema = new mongoose.Schema({
	Username: {
		type: String,
		unique: true,
		required: true,
		trim: true,
	},
	Email: {
		type: String,
		required: true,
		trim: true,
	},
	Password: {
		type: String,
		required: true,
		trim: true,
	},
	Phone: {
		type: Number,
		required: true,
		trim: true,
	},
	Organization: {
		type: String,
	},
	Payment: {
		type: String,
	},
	fName: {
		type: String,
	},
	lName:{
		type: String,
	},
	brunei:{
		type: String,
	},
	temburong: {
		type: String,
	},
	tutong: {
		type: String,
	},
	seria: {
		type: String,
	},
	kb: {
		type: String,
	},
	outside: {
		type: String,
	},
});

const Runner = mongoose.model('Runner', RunnerSchema);
module.exports = Runner;