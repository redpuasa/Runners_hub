const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
	Email: {
		type: String,
		required: true,
		trim: true,
	},
	Username: {
		type: String,
		required: true,
		trim: true,
	},
	fName:{
		type: String,
	},
	Password: {
		type: String,
		required: true,
		trim: true,
	},
	Address: {
		type: String,
		required: true,
		trim: true,
	},
	Phone: {
		type: Number,
		required: true,
		trim: true,
	},
	Status: {
		type: String,
	},
});

const User = mongoose.model('User', UserSchema);
module.exports = User;