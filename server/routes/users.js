var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('/user ,Hi Api ~!');
});

module.exports = router;
