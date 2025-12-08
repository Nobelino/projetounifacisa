const { v4: uuidv4 } = require('uuid');

function generateCode() {
	const code = Math.floor(100000 + Math.random() * 900000).toString();
	const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
	return { code, expiresAt, id: uuidv4() };
}

module.exports = { generateCode };
