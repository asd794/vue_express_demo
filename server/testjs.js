var {connection} = require('./db/db.js');

const time = new Date();
const options = { 
  timeZone: 'Asia/Taipei', 
  year: 'numeric', 
  month: '2-digit', 
  day: '2-digit',
//   hour: '2-digit', 
//   minute: '2-digit', 
//   second: '2-digit'
};
const taipeiDate = time.toLocaleDateString('zh-TW', options).replace(/\//g, '-');
console.log('目前台北時間:', taipeiDate);

// sql查詢callbalck funtion
function queryDatabase(query, callback) {
  connection.query(query, (err, results) => {
      if (err) {
          return callback(err);
      }
      callback(null, results);
  });
}

let last =0;
queryDatabase('SELECT * FROM Products WHERE Member_ID=8', (err, results) => {
  if (err) {
      console.error('查詢時出錯:', err.stack);
  } else {
    last = results[results.length-1].Product_ID;
    connection.end();
    queryDatabase(`update Products set Image ='"+"./public/shop_static/picture/${memberLastProduct} where Product_ID=${memberLastProduct};`, (errUpdate, resultsUpdate) => {
      if (errUpdate) {
          console.error('更新圖片位置時出錯:', errUpdate.stack);
      } else {
          console.log('更新圖片位置完成~!');
      }
    });
  }
});

console.log(last);

