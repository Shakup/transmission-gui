var request = require('request');
var request = require('request');

function TMDb (cnf) {
	this.endpoint = cnf.endpoint || 'http://api.themoviedb.org/3';
	this.api_key  = cnf.api_key;
	this.token    = null;
};

TMDb.prototype.request = function (params, cb) {
	var self  = this;

	var options = {
		'uri': this.endpoint + params.path,
		'method': params.method || 'GET',
		'headers': {
			'Time': new Date(),
			'X-Requested-With': 'TransmissionGUI',
			'Accept': 'application/json'
		}
	};

	var callback = function (err, response, body) {

		function throwError (err) {
			console.log(err);
			cb(err);
		}

		if (err) {
			throwError({
				'code': 500,
				'message': "Hmm, an error occured..."
			});
		} else {

			if (response.statusCode === 401) {
				throwError({
					'code': 401,
					'message': "Invalid or missing TMDb token"
				});
			} else if (response.statusCode === 200) {
				cb(null, JSON.parse(body));
			} else {
				throwError({
					'code': 400,
					'message': "Outch, can't perform the request"
				});
			}

		};

	};

	request(options, callback);

};

TMDb.prototype.auth = function (cb) {
	var
		self   = this,
		params = {
			'path': '/authentication/guest_session/new?api_key=' + this.api_key
		};

	function callback (err, data) {
		if (!err) {
			self.token = data.guest_session_id;
		};

		cb(err, data);
	}

	this.request(params, callback);
};

TMDb.prototype.search = function (pattern, cb) {
	var params = {
		'path': '/search/movie?query=' + encodeURIComponent(pattern) + '&api_key=' + this.api_key
	}

	this.request(params, cb);
};

module.exports = TMDb;