var express = require('express');
var router = express.Router();
var {connection} = require('../db/db.js');
const session = require('express-session');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 設定multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 設置臨時上傳目錄temp，先上傳圖片，後續在/upload移動到目的資料夾
    const tempDir = path.join(__dirname, '../public/shop_static/picture/temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    // 使用時間當作名稱，以防名稱衝突
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


// sql查詢callbalck funtion
function queryDatabase(query, callback) {
  connection.query(query, (err, results) => {
      if (err) {
          return callback(err);
      }
      callback(null, results);
  });
}

// 產品資料
router.get('/products', function(req, res) {

  queryDatabase('SELECT * FROM Products', (err, results) => {
      if (err) {
          console.error('查詢時出錯:', err.stack);
      } else {
          res.json(results)
      }
  });

});

// 單一產品資料
router.get('/products/:id', function(req, res) {
  const productId = req.params.id;
  // const product = products[productId];
  console.log(productId);
  console.log('SELECT * FROM Products WHERE Product_ID=' + productId +';');
  queryDatabase('SELECT * FROM Products WHERE Product_ID=' + productId +';', (err, results) => {
      if (err) {
          console.error('查詢時出錯:', err.stack);
      } else {
          res.json(results[0])
      }
  });

});


// 個人訂單資料
router.get('/myorders', function(req, res) {

  queryDatabase(`SELECT * FROM Orders WHERE Buyer_ID=${req.session.Member_ID};`, (err, results) => {
      if (err) {
          console.error('查詢時出錯:', err.stack);
      } else {
          res.json(results)
      }
  });

});

// 個人產品資料
router.get('/myproducts', function(req, res) {

  queryDatabase('SELECT * FROM Products WHERE Member_ID=' + req.session.Member_ID +';', (err, results) => {
      if (err) {
          console.error('查詢時出錯:', err.stack);
      } else {
          res.json(results)
      }
  });

});

// 上架產品和圖片
router.post('/upload', upload.single('file'), (req, res) => {
  const { productName, price, amount, description } = req.body;

  console.log('File:', req.file);
  console.log('productName:', productName);
  console.log('price:', price);
  console.log('amount:', amount);
  console.log('description:', description);

  if (!req.file) {
    return res.status(400).json({ message: 'File is missing' });
  }

  // 設定日期
  const time = new Date();
  const options = { 
    timeZone: 'Asia/Taipei', 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
  };
  const taipeiDate = time.toLocaleDateString('zh-TW', options).replace(/\//g, '-');

  // 資料庫插入產品資料
  queryDatabase(`INSERT INTO Products VALUES (NULL, '${productName}', '${description}', ${price}, ${amount}, '', '${taipeiDate}', ${req.session.Member_ID});`, (errInsert, resultsInsert) => {
    if (errInsert) {
      console.error('数据库插入时出错:', errInsert.stack);
      return res.status(500).json({
        message: 'Database insert failed',
        error: errInsert.message
      });
    }

    console.log('資料庫插入(上架)產品資料完成(尚未插入圖片路徑)');

    queryDatabase(`SELECT * FROM Products WHERE Member_ID=${req.session.Member_ID};`, (errSelect, resultsSelect) => {
      if (errSelect) {
        console.error('查詢會員已上架產品數量出錯:', errSelect.stack);
      } else {
        const memberLastProduct = resultsSelect[resultsSelect.length - 1].Product_ID;
        const finalDir = path.join(__dirname, `../public/shop_static/picture/${memberLastProduct}`);

        if (!fs.existsSync(finalDir)) {
          fs.mkdirSync(finalDir, { recursive: true });
        }

        const finalPath = path.join(finalDir, '1.jpg');

        // 移動圖片到目的資料夾
        fs.rename(req.file.path, finalPath, (err) => {
          if (err) {
            console.error('移動圖片時出錯:', err);
            return res.status(500).json({ message: 'File move failed', error: err.message });
          } 
          // 資料庫更新剛上傳的圖片路徑
          queryDatabase(`UPDATE Products SET Image='./public/shop_static/picture/${memberLastProduct}/1.jpg' WHERE Product_ID=${memberLastProduct};`, (errUpdate, resultsUpdate) => {
            if (errUpdate) {
              console.error('更新圖片位置時出錯:', errUpdate.stack);
              return res.status(500).json({ message: 'Image update failed', error: errUpdate.message });
            } else {
              console.log('更新圖片位置完成!');
              return res.status(200).json({
                message: 'File uploaded and data inserted successfully',
                file: finalPath
              });
            }
          });
        });
      }
    });
  });
});



// 註冊會員
router.post('/member', function(req, res) {

  queryDatabase('SELECT * FROM Members', (err, results) => {
      if (err) {
        console.error('查詢Memebers時出錯:', err.stack);
      } else {
        const { name, email, password } = req.body; // 獲取從前端傳來的數據
        console.log('Received data:', { name, email, password });

        // 判斷前端傳來值是否正常
        if (name === "" || name === undefined || name === null || email === "" || email === undefined || email === null || password === "" || password === undefined || password === null){
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

// 會員更改名稱,密碼
router.patch('/member', function(req, res) {
  const memberId = req.body.Member_ID;
  const newName = req.body.newName;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const condition = req.body.condition;
  console.log(memberId,condition,newName,oldPassword,newPassword);


  switch (condition) {
    case "changeName": {      
      if (newName === "" || newName === undefined || newName === null) {
        console.log('newName,不能為空');
        res.status(404).send('新名稱,不能為空');
      }else{
        if (req.session.Member_ID === memberId) {
          console.log(req.session.Member_ID);
          console.log('session 會員ID和傳來的會員ID比對正確');   
          queryDatabase("UPDATE Members SET Name='" + newName + "' WHERE Member_id=" + memberId + ";", (err, results) => {
            if (err) {
              console.error('新增會員時出錯:', err.stack);
            } else {
              console.log('變更新名稱完成~!');
              req.session.Name = newName;
              res.status(200).json({ message: 'ok' });
            }
          });
      
        }else{
          console.log(req.session.Member_ID);
          console.log("session 會員ID和傳來的會員ID比對不一樣");
          res.status(404).send('error');
        }
      }
      break;
    }
    case "changePassword": {
      if (oldPassword === "" || oldPassword === undefined || oldPassword === null || newPassword === "" || newPassword === undefined || newPassword === null) {
        console.log('oldPassword或newPassword,不能為空');
        res.status(404).send('舊密碼 或 新密碼,不能為空');
      }else{
        // select Member_ID,Name,Password from Members where Member_ID = 8;
        queryDatabase("SELECT Member_ID,Name,Password FROM Members WHERE Member_ID = " + memberId + ";", (err, results) => {
          if (err) {
            console.error('查詢Memebers時出錯:', err.stack);
            res.status(404).send('error');
          }else{
            console.log("資料庫查詢密碼:",results[0].Password, typeof(results[0].Password));
            console.log("oldPassword:",oldPassword, typeof(oldPassword));
            if (results[0].Password === oldPassword) {
              queryDatabase("UPDATE Members SET Password='" + newPassword + "' WHERE Member_id=" + memberId + ";", () => {});
              console.log("舊密碼與新密碼比對正確，修改Member_id("+memberId+")密碼")
              res.status(200).json({ message: 'ok' });
            }else{
              console.log("舊密碼比對不正確");
              res.status(404).send('舊密碼輸入錯誤');
            }
            
          }          
        });

      }    
      break;
    }
  }


  // res.status(200).json({
  //   status: 'OK',
  //   value: 'patch確認',
  //   query: req.query,
  //   params: req.params,
  //   body: req.body,
  // });

});

// 刪除單一產品購物車
router.delete('/mycart/:id', function(req, res) {
  const productId = req.params.id;
  console.log('準備刪除某單一產品',productId)
  queryDatabase(`DELETE FROM Carts WHERE Product_ID=${productId} AND Member_ID=${req.session.Member_ID};`, () => {});
  res.status(200).json({message: '購物車單一產品刪除完成~!'});
})

// 清除購物車
router.delete('/mycart', function(req, res) {
  queryDatabase(`DELETE FROM Carts WHERE Member_ID=${req.session.Member_ID};`, () => {});
  res.status(200).json({message: '購物車清除完成~!'});
})

// 加入購物車
router.post('/mycart', function(req, res) {
  const {productID, selectAmount, productPrice} = req.body;
  console.log(`productID=${productID}`, `selectAmount=${selectAmount}`, `productPrice=${productPrice}`);

  // 確保只被發送一次
  let responseSent = false;

  if(selectAmount === "" || selectAmount === undefined || selectAmount === null ){
    res.status(400).json({ message: '請選擇正確數量' });
    responseSent = true;
  }

  // 先比對產品是否已在會員的購物車資料表裡
  queryDatabase(`SELECT * FROM Carts WHERE Member_ID=${req.session.Member_ID};`, (err, resultsSelectCart) => {
    if (err) {
      console.error(`查詢 SELECT * FROM Carts WHERE Member_ID=${req.session.Member_ID}; 出錯:`, err.stack);
      if (!responseSent) {
        res.status(500).json({ message: 'Database query failed', error: err.message });
        responseSent = true;
      }
    } else {
      console.log(resultsSelectCart);

      let productInCart = false;

      for (const key in resultsSelectCart) {
        if (productID == resultsSelectCart[key].Product_ID) {
          productInCart = true;
          // 如果比對成有在購屋車裡，則在比對加入購物車數量是否會超過產品的總數量
          queryDatabase(`SELECT Amount FROM Products WHERE Product_ID=${productID};`, (err, resultsSelectProduct) => {
            if (err) {
              console.error(`查詢 SELECT Amount FROM Products WHERE Product_ID=${productID}; 出錯:`, err.stack);
              if (!responseSent) {
                res.status(200).json({ message: 'Database query failed', error: err.message });
                responseSent = true;
              }
            } else {
              console.log('resultsSelectProductAmount:', resultsSelectProduct[0].Amount);

              if (selectAmount + resultsSelectCart[key].Amount <= resultsSelectProduct[0].Amount) {
                // 如果沒超過產品總數量，則修改購物車的數量，否則回傳超過數量訊息給前端
                queryDatabase(`UPDATE Carts SET Amount=${resultsSelectCart[key].Amount + selectAmount} WHERE Member_ID=${req.session.Member_ID} AND Product_ID=${productID};`, (errUpdate) => {
                  if (errUpdate) {
                    console.error(`更新 UPDATE Carts SET Amount=${resultsSelectCart[key].Amount + selectAmount} WHERE Member_ID=${req.session.Member_ID} AND Product_ID=${productID}; 出錯:`, errUpdate.stack);
                    if (!responseSent) {
                      res.status(200).json({ message: 'Update cart failed', error: errUpdate.message });
                      responseSent = true;
                    }
                  } else {                    
                    if (!responseSent) {
                      console.log('購物車完成更新~!');
                      res.status(200).json({ message: '購物車完成數量更新~!' });
                      responseSent = true;
                    }
                  }
                });
              } else {
                console.log('錯誤，加入購物車後數量會超過產品總數');
                if (!responseSent) {
                  res.status(400).json({ message: '錯誤，加入購物車後數量會超過產品總數~!' });
                  responseSent = true;
                }
              }
            }
          });
        }
      }

      if (!productInCart && !responseSent) {
        // 上面比對後不在會員的購物車裡，所以新增一筆到購物車
        queryDatabase(`INSERT INTO Carts VALUES(NULL,${productPrice},${selectAmount},${req.session.Member_ID},${productID});`, (errInsert) => {
          if (errInsert) {
            console.error(`新增購物車 INSERT INTO Carts VALUES(NULL,${productPrice},${selectAmount},${req.session.Member_ID},${productID}); 出錯:`, errInsert.stack);
            if (!responseSent) {
              res.status(500).json({ message: 'Insert cart failed', error: errInsert.message });
              responseSent = true;
            }
          } else {            
            if (!responseSent) {
              console.log('購物車新增完成~!');
              res.status(200).json({ message: '購物車新增完成~!' });
              responseSent = true;
            }
          }
        });
      }
    }
  });
});



// 查詢我的購物車
router.get('/mycart', function(req, res) {
  queryDatabase(`SELECT * FROM Carts WHERE Member_ID=${req.session.Member_ID};`, (err, results) => {
    if (err) {
      console.error('查詢購物車時出錯:', err.stack);
      res.status(404).send('sql error');
    } else {
      console.log('查詢購物車資料庫完成~!');
      console.log(results);
      res.status(200).json({ results });
      
    }
  });

  
});


// 下訂單
router.post('/sendorder',function(req, res){
  function randomMID(){
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let tempRandomString = '';
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      tempRandomString += chars[randomIndex];
    }
    // console.log(tempRandomString);
    return tempRandomString
  }
  const { name, phone, address, notes } = req.body; // 獲取從前端傳來的數據
  console.log('Received data:', { name, phone, address, notes });

  if (!name || !phone || !address ) {
    return res.status(200).json({ message: '*必填欄位不能為空' });
  }

  let randomString = randomMID();
  queryDatabase('SELECT Order_MID FROM Orders', (err, results) => {
    if (err) {
      console.error('查詢Orders時出錯:', err.stack);
    } else {
      
      // console.log(results);
      let compare = 0;
      while (compare < 1){
        for (const index in results){
          console.log(compare);
          console.log(randomString);
          console.log(results[index]);
          compare++; // 比對後沒在裡面，所以讓while跳出不再執行
          // 比對產生的MID是否有在資料庫裡面，如果已存在裡面，再重新產生的一個MID
          if(randomString === results[index].Order_MID) {
            console.log('隨機產生亂數無法新增到Orders資料庫的Order_MID,因為已經有一樣的,請再次重新產生亂數。')
            randomString = randomMID();  // 拿到新的MID
            compare = 0; // compare=0,讓while繼續執行          
            break;
          }          
        }        
      }     
    }
  });


  // 得到現在時間
  let now = new Date();

  // 年、月、日、时、分、秒
  let year = now.getFullYear(); // 年
  let month = String(now.getMonth() + 1).padStart(2, '0'); // 月
  let day = String(now.getDate()).padStart(2, '0'); // 日
  let hours = String(now.getHours()).padStart(2, '0'); // 时
  let minutes = String(now.getMinutes()).padStart(2, '0'); // 分
  let seconds = String(now.getSeconds()).padStart(2, '0'); // 秒

  // 修改所需格式
  let formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  // let a = `SELECT * FROM Carts WHERE Member_ID=${req.session.Member_ID};`;
  queryDatabase(`SELECT Carts.Cart_ID, Carts.Price, Carts.Amount, Carts.Member_ID, Carts.Product_ID, Products.Product_Name,Products.Amount AS Origin_Amount , Products.Member_ID AS Seller_ID, Products.Image FROM Carts INNER JOIN Products ON Carts.Product_ID=Products.Product_ID WHERE Carts.Member_ID=${req.session.Member_ID};
`, (err, results) => {
    if (err) {
      console.error('查詢購物車時出錯:', err.stack);
    } else {

      // console.log(results)
      // 增加
      for (const length in results){
        console.log(results[length]);
        queryDatabase(`INSERT INTO Orders VALUES(null ,'${randomString}' ,${results[length].Price}, ${results[length].Amount} ,'${name}' ,${phone} ,'${address}' ,'${notes}' ,'${formattedDateTime}', ${results[length].Product_ID}, ${results[length].Seller_ID}, ${req.session.Member_ID});`, () => {});
        queryDatabase(`UPDATE Products SET Amount =${results[length].Origin_Amount-results[length].Amount} WHERE Product_ID=${results[length].Product_ID};`, () => {});
      }
      queryDatabase(`DELETE FROM Carts WHERE Member_ID=${req.session.Member_ID};`, () => {});
    }
  });
  
  res.status(200).json({message: '訂單送出成功~!'});


});





// 會員登入
router.post('/login', function(req, res) {

  queryDatabase('SELECT * FROM Members', (err, results) => {
      if (err) {
        console.error('查詢Memebers時出錯:', err.stack);
      } else {
        const { email, password } = req.body; // 獲取從前端傳來的數據
        console.log('Received data:', { email, password });

        // 判斷前端傳來值是否正常
        if (email === "" || email === undefined || email === null || password === "" || password === undefined || password === null){
          // res.status(404).send("404 Not found.");
          res.status(200).json({ message: 'Error' });
          return ;
        }
        // 查詢email是否在資料庫
        for(const key in results){
          // 比對帳號
          if (email == results[key]['Email']){
            console.log('帳號比對正確，進入下一層密碼比對~!');
            // 帳號正確，再進行比對密碼
            if (password ==results[key]['Password']){
              console.log('密碼也比對正確，成功登入~~!!')
              req.session.Member_ID = results[key]['Member_ID'];
              req.session.Email = results[key]['Email'];
              req.session.Name = results[key]['Name'];
              req.session.Sid = req.sessionID;
              console.log(req.session);
              res.status(200).json({ message: 'correct' });
              return ;
            }else{
              console.log('密碼比對錯誤~');
              // res.status(404).send("404 Not found.");
              res.status(200).json({ message: 'Error' });
              return ;
            }
          }
        
        }
        console.log('帳號比對錯誤~');
        // res.status(404).send("404 Not found.");
        res.status(200).json({ message: 'Error' });
      }

  });
  
});

// 會員登出
router.get('/logout', function(req, res) {
  req.session.destroy();
  console.log(req.session);
  // 因為Access-Control-Allow-Origin=*，所以手動新增hearer
  // res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  // res.header("Access-Control-Allow-Credentials", "true");
  // res.redirect('http://localhost:5173/login');
  res.status(200).json({ message: 'logoutCorrect' });
});

// 查看session狀態
router.post('/session', function(req, res) {
  console.log(req.session);
  if ('Email' in req.session == false){
    // res.status(404).send("404 Not found.");
    res.json({ isAuthenticated: false });
  }else{
    // res.status(200).json(req.session);
    res.json({ 
      isAuthenticated: true,
      'Email': req.session.Email,
      'Name': req.session.Name,
      'Member_ID': req.session.Member_ID
     });
  }
});

router.patch('/sessionout', function(req, res) {
 
  req.session.destroy();
  console.log(req.session);
  return res.send('clean~!');
});




router.get('/', function(req, res) {
  res.render('test', rendeData);
});

/* GET test page. */
router.post('/',function(req, res){
  res.json({
    status: 'ok',
    value: 'hello post ! 建立完成 !',
  });
});

router.post('/post',function(req, res){
  res.json({
    status: 'OK',
    value: '/test/post'
  });
});

router.post('/post/:id',function(req, res){
  res.json({
    status: 'OK',
    value: 'hello post2！建立好囉!!!',
    query: req.query,
    params: req.params,
    body: req.body
  });
});

router.get('/get',function(req, res){
  res.json({
    status: 'OK',
    value: '/test/get！建立好囉！',
    query: req.query,
  });
});

router.get('/get/:id',function(req, res){
  res.json({
    status: 'OK',
    value: '/test/get2！建立好囉！',
    query: req.query,
    params: req.params,
  });
});

router.put('/put/:id',function(req, res){
  res.json({
    status: 'OK',
    value: 'hello put！建立好囉！',
    query: req.query,
    params: req.params,
    body: req.body

  });
});

router.patch('/patch/:id',function(req, res){
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

router.delete('/delete/:id',function(req, res){
  res.json({
    status: 'OK',
    value: 'hello delete！建立好囉！',
    query: req.query,
    params: req.params,
    body: req.body
  });
});





module.exports = router;
