module.exports = function requestFilter(req, res, next) {
	if (!req.headers['x-app-version']) {
		console.warn('Requisição sem X-App-Version');
	}
	next();
};
