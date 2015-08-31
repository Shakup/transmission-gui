var request      = require('request');

function Transmission (cnf) {

	this.url           = cnf.url || "/transmission/rpc";
	this.host          = cnf.host || "localhost";
	this.port          = cnf.port || 9091;
	this.torrentFields = ['hashString', 'addedDate', 'bandwidthPriority', 'comment', 'dateCreated', 'doneDate', 'downloadDir', 'downloadedEver', 'downloadLimit', 'error', 'errorString', 'files', 'id', 'isFinished', 'leftUntilDone', 'magnetLink', 'maxConnectedPeers', 'name', 'peer-limit', 'peersConnected', 'percentDone', 'rateDownload', 'rateUpload', 'recheckProgress', 'seedRatioLimit', 'seedRatioMode', 'sizeWhenDone', 'startDate', 'status', 'totalSize', 'torrentFile', 'uploadedEver', 'uploadLimit', 'uploadLimited', 'uploadRatio'];

	if (cnf.username) {
		this.authHeader = "Basic " + new Buffer(cnf.username + (cnf.password ? ":" + cnf.password : "")).toString('base64');
	}

};

Transmission.prototype.request = function (params, cb) {
	var self = this;

	var options = {
		'uri': 'http://' + this.host + ':' + this.port + this.url,
		'method': 'POST',
		'json': true,
		'body': {
			'method'  : params.method,
			'arguments' : params.arguments
		},
		'headers': {
			'Time': new Date(),
			'Host': this.host + ':' + this.port,
			'X-Requested-With': 'TransmissionGUI',
			'X-Transmission-Session-Id': this.sessionId || '',
			'Content-Type': 'application/json'
		}
	};

	if (this.authHeader) {
		options.headers.Authorization = this.authHeader;
	}

	var callback = function (err, response, body) {

		function throwError (err) {
			cb(err);
		}

		if (err) {
			throwError({
				'code': 500,
				'message': "Hmm, an error occured..."
			});
		} else {

			if (response.statusCode === 409 ) {
				self.sessionId = response.headers['x-transmission-session-id'];
				self.request(params, cb);
				return;
			} else if (response.statusCode === 200) {
				cb(null, body.arguments);
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

Transmission.prototype.session = function (cb) {
	var params = {
		'method': 'session-get'
	};

	this.request(params, cb);
};

Transmission.prototype.stats = function (cb) {
	var params = {
		'method': 'session-stats'
	};

	this.request(params, cb);
};

Transmission.prototype.activities = function (cb) {
	var params = {
		'arguments': {
			'fields': this.torrentFields,
			'ids': 'recently-active'
		},
		'method': 'torrent-get'
	};

	function callback (err, data) {
		cb(err, data.torrents || []);
	}

	this.request(params, cb);
};

Transmission.prototype.all = function (cb) {
	var params = {
		'arguments': {
			'fields': this.torrentFields
		},
		'method': 'torrent-get'
	};

	function callback (err, data) {
		cb(err, data.torrents);
	}

	this.request(params, callback);
};

Transmission.prototype.get = function (id, cb) {
	var params = {
		'arguments': {
			'fields': this.torrentFields,
			'ids': [id]
		},
		'method': 'torrent-get'
	};

	this.request(params, cb);
};

Transmission.prototype.start = function (id, cb) {
	var params = {
		'arguments': {
			'ids': [id]
		},
		'method': 'torrent-start'
	};

	this.request(params, cb);
}

module.exports = Transmission;