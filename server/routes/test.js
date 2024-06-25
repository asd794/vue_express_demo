var express = require('express');
var router = express.Router();

let rendeData = { title: '什麼都略懂一點，生活更多彩一些', navBar: [
  {
    name: '努力',
  },
  {
    name: '堅持',
  },
  {
    name: '入門',
  },
  {
    name: '放棄',
  },
]}

router.get('/', function(req, res, next) {
  res.render('test', rendeData);
});

/* GET test page. */
router.post('/',function(req, res, next){
  res.json({
    status: 'ok',
    value: 'hello post ! 建立完成 !',
  });
});

router.post('/post',function(req, res, next){
  res.json({
    status: 'OK',
    value: '/test/post'
  });
});

router.post('/post/:id',function(req, res, next){
  res.json({
    status: 'OK',
    value: 'hello post2！建立好囉!!!',
    query: req.query,
    params: req.params,
    body: req.body
  });
});

router.get('/get',function(req, res, next){
  res.json({
    status: 'OK',
    value: '/test/get！建立好囉！',
    query: req.query,
  });
});

router.get('/get/:id',function(req, res, next){
  res.json({
    status: 'OK',
    value: '/test/get2！建立好囉！',
    query: req.query,
    params: req.params,
  });
});

router.put('/put/:id',function(req, res, next){
  res.json({
    status: 'OK',
    value: 'hello put！建立好囉！',
    query: req.query,
    params: req.params,
    body: req.body

  });
});

router.patch('/patch/:id',function(req, res, next){
  res.json({
    status: 'OK',
    value: 'hello patch！建立好囉！',
    query: req.query,
    params: req.params,
    body: req.body,
    // ReqHeader: req.headers,
    ReqHeadertestHeaderKey: req.headers.testheaderkey
  });
});

router.delete('/delete/:id',function(req, res, next){
  res.json({
    status: 'OK',
    value: 'hello delete！建立好囉！',
    query: req.query,
    params: req.params,
    body: req.body
  });
});





module.exports = router;
