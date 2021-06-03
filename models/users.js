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
	User_Status: {
		type: String, 
      	enum: ['Pending', 'Active'],
      	default: 'Pending'
	},
    Verfication_Code: { 
      	type: String, 
      	unique: true 
	}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;