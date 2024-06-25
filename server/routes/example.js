var express = require('express');
var router = express.Router();
var {connection} = require('../db/db.js');


var cors = require('cors');
// app.use(cors());

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

// router.get('/products', function(req, res, next) {
//   function queryDatabase(query, callback) {
//       connection.query(query, (err, results) => {
//           if (err) {
//               return callback(err);
//           }
//           callback(null, results);
//       });
//   }
//   queryDatabase('SELECT * FROM Products', (err, results) => {
//       if (err) {
//           console.error('查詢時出錯:', err.stack);
//       } else {
//           res.json(results)
//       }
//   });
// });



function queryDatabase(query, callback) {
  connection.query(query, (err, results) => {
      if (err) {
          return callback(err);
      }
      callback(null, results);
  });
}

// 產品資料
router.get('/products', function(req, res, next) {

  queryDatabase('SELECT * FROM Products', (err, results) => {
      if (err) {
          console.error('查詢時出錯:', err.stack);
      } else {
          res.json(results)
      }
  });
});

// 註冊會員
router.post('/users', function(req, res, next) {
  queryDatabase('SELECT * FROM Members', (err, results) => {
      if (err) {
        console.error('查詢Memebers時出錯:', err.stack);
      } else {
        const { name, email, password } = req.body; // 獲取從前端傳來的數據
        console.log('Received data:', { name, email, password });

        // 判斷前端傳來值是否正常
        if (name == "" || name == undefined || name == null || email == "" || email == undefined || email == null || password == "" || password == undefined || password == null){
          res.status(404).send("404 Not found.");
          return ;
        }
        // 
        for(const key in results){
          // console.log(key,results[key]['Email']); // 查看查詢狀況 
          if (email == results[key]['Email']){
            // return res.json({ message: 'UserFound', email });
            res.status(200).json({ message: 'EmailFound' });
            return ;
          }
        }
        // res.status(200).json({ message: 'EmailNotFound' });

        queryDatabase("insert into Members(Member_ID,Name,Email,Password) values(NULL,'" + name + "','" + email + "','" + password + "');", (err, results) => {
          if (err) {
            console.error('新增會員時出錯:', err.stack);
          } else {
            console.log('會員新增成功~!');
            res.status(200).json({ message: 'EmailNotFound' });
          }
        });

      }
  });
  
});



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
