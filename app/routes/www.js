var express = require('express');
var router  = express.Router();

/**
 * Index
 */
router.get('/', require('../controllers/index.js'));

/**
 * 404 
 */
function set404 (req, res) {
	res.status(404);
	res.send("<h1>Page not found!</h1>");
}

router.use(set404);

module.exports = router;