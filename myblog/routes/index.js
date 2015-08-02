var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('^\/$|^\/index$', function(req, res, next) {
  res.render('index', { title: 'index', layout:"base" });
});

router.post('/sendBlog', function(req, res, next) {
	
  
});

module.exports = router;
