var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/u/:user', function(req, res) {
  res.send('respond with a resource');
});

router.get('/reg', function(req, res) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res) {
  res.send('respond with a resource');
});

router.get('/logout', function(req, res) {
  res.send('respond with a resource');
});

/* POST users listing. */
router.post('/reg', function(req, res) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res) {
  res.send('respond with a resource');
});

module.exports = router;
