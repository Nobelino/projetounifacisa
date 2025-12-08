const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		cpf: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		passwordHash: { type: String, required: true },
		twoFactorCode: { code: String, expiresAt: Date },
		preferences: { type: [String], default: [] }
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
