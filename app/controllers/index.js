var app  = require('../app');
var cnf  = app.get('config');
var fs   = require('fs');
var path = require('path');

module.exports = function (req, res) {

	var
		covers   = fs.readdirSync( path.resolve(__dirname, '../public/img/covers')),
		nbCovers = 0;

	covers.forEach(function (file) {
		if (path.extname(file) === '.jpg') {
			nbCovers++;
		};
	});

	res.render('index', {
		title: "Welcome on Transmission GUI",
		username: "Sébastien",
		cover: Math.floor((Math.random() * nbCovers) + 1),
		covers: nbCovers
	});

};