var express      = require('express');
var colors       = require('colors');
var bodyParser   = require('body-parser');
var handlebars   = require('express-handlebars');
var path         = require('path');
var YAML         = require('yamljs');
var app          = module.exports = express();


/**
 * Configure app
 */
app
	.set( 'config', YAML.load( __dirname + '/config.yml' ))
	.use( bodyParser.urlencoded({ extended: false }) )
	.use( '/assets', express.static( __dirname + '/public') )
	.use(function (req, res, next) {
		res.setHeader('X-Powered-By', "Transmission GUI - https://github.com/Shakup/transmission-gui");
		next();
	});


/**
 * Define Handlebars as default engine
 */
var hbs = handlebars.create({
	extname: '.hbs',
	layoutsDir: __dirname + '/views/layouts',
	partialsDir: __dirname + '/views/partials',
	defaultLayout: 'main',
	helpers: require('./utils/hbs')
});

app
	.engine('hbs', hbs.engine)
	.set('views', __dirname + '/views')
	.set('view engine', 'hbs');


/**
 * API routes
 */
app.use('/api', require('./routes/api') );


/**
 * Front routes
 */
app.use('/', require('./routes/www') );


/**
 * Launch http server
 */
app.listen( app.get('config').server.port, function () {
	console.log( ("Transmission GUI is launched!").green.bold );
});