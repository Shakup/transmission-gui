module.exports = function (req, res, next) {

	var isValidUser = true;

	if (isValidUser) next();
	else {
		res.status(403);
		res.json({
			"error": true,
			"code": 403,
			"message": "Access denied"
		});
	}

};