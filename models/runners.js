const mongoose = require("mongoose");
const RunnerSchema = new mongoose.Schema({
	Username: {
		type: String,
	},
	Email: {
		type: String,
	},
	Password: {
		type: String,
	},
	Phone: {
		type: Number,
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