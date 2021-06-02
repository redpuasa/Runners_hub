const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
	Username: {
		type: String,
	},
	Email: {
		type: String,
	},
	Password: {
		type: String,
	},
	Address: {
		type: String,
	},
	Phone: {
		type: Number,
	}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;