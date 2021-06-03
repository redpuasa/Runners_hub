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
	}
});

const Runner = mongoose.model('Runner', RunnerSchema);

module.exports = Runner;