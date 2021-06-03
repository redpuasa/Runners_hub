const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
	Username: {
		type: String,
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
	}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;