var app          = require('../app');
var cnf          = app.get('config');
var express      = require('express');
var router       = express.Router();
var Transmission = require('../libs/transmission');
var torrent      = new Transmission(cnf.transmission);
var TMDb         = require('../libs/tmdb');
var tmdb         = new TMDb(cnf.tmdb);
var utils        = require('../utils/utils');


/**
 * Trigger error
 */
function triggerError (res, code, message) {
	res.status(code);
	res.json({
		'status': "error",
		'code': code,
		'message': message
	});
}


/**
 * Verif user authentification
 */
router.all('/*', require('../middlewares/auth'));


/**
 * Get current session
 */
router.get('/torrent/session', function (req, res) {

	torrent.session(function (err, data) {
		if (err) {
			triggerError(res, err.code, err.message);
			return;
		};

		res.json(data);
	});

});


/**
 * Get session stats
 */
router.get('/torrent/stats', function (req, res) {

	torrent.stats(function (err, data) {
		if (err) {
			triggerError(res, err.code, err.message);
			return;
		};

		res.json(data);
	});

});


/**
 * Get torrents activities
 */
router.get('/torrent/activities', function (req, res) {

	torrent.activities(function (err, data) {
		if (err) {
			triggerError(res, err.code, err.message);
			return;
		};

		res.json(data);
	});

});


/**
 * Get all torrents
 */
router.get('/torrent/all', function (req, res) {

	torrent.all(function (err, data) {
		if (err) {
			triggerError(res, err.code, err.message);
			return;
		};

		res.json(data);
	});

});


/**
 * Get single torrent
 */
router.get('/torrent/get/:id', function (req, res) {

	var id = req.params.id || null;

	if (!id || isNaN(id)) {
		triggerError(res, 400, "You must specified a valid torrent id");
		return;
	};

	torrent.get(id, function (err, data) {
		if (err) {
			triggerError(res, err.code, err.message);
			return;
		};

		res.json(data);
	});

});


/**
 * Start torrent
 */
router.get('/torrent/start/:id', function (req, res) {

	var id = req.params.id || null;

	if (!id || isNaN(id)) {
		triggerError(res, 400, "You must specified a valid torrent id");
		return;
	};

	torrent.start(id, function (err, data) {
		if (err) {
			triggerError(res, err.code, err.message);
			return;
		};

		res.json(data);
	});

});


/**
 * Get TheMovieDB guest token
 */
router.get('/tmdb/auth', function (req, res) {

	tmdb.auth(function (err, data) {
		if (err) {
			triggerError(res, err.code, err.message);
			return;
		};

		res.json(data);
	});

});


/**
 * Search movie
 */
router.get('/tmdb/search/:pattern', function (req, res) {

	var pattern = utils.sanitizeFileName( req.params.pattern );

	tmdb.search(pattern, function (err, data) {
		if (err) {
			triggerError(res, err.code, err.message);
			return;
		};

		res.json(data);
	});

});

/**
 * Bad request 
 */

router.use(function (req, res) {
	triggerError(res, 400, "Bad request");	
});

module.exports = router;