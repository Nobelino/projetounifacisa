const mongoose = require('mongoose');

async function connectDB(uri) {
	if (!uri) throw new Error('MONGO_URI não configurada');

	await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	console.log('MongoDB conectado');
}

module.exports = connectDB;
