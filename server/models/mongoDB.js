// const uri = "mongodb+srv://asd123753951:XVjAIyz5SKKdS4ku@ithelp.eb4bso5.mongodb.net/?retryWrites=true&w=majority&appName=ItHelp";




// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// mongoose.connect('mongodb+srv://asd123753951:XVjAIyz5SKKdS4ku@ithelp.eb4bso5.mongodb.net/?retryWrites=true&w=majority&appName=ItHelp', { 
//   useNewUrlParser: true, 
//   useUnifiedTopology: true 
// });
// // 連接資料庫

// const accounts = new Schema({
//   account_id: { type: Number},
//   limit: { type: Number},
//   products: { type: Array},
// });
// // 撰寫模型

// const MyModel = mongoose.model('accounts', accounts, 'accounts');
// // 註冊該模型並定義模型名稱

// MyModel.find({}, function(err, docs){
//   console.log(docs);
// })

/////////////////////////////////////////

const schemaModels = require('./schemaModels');
const mongoose = require('mongoose');

function create (collectionName, inserObject) {
  return new Promise(function (resolve, reject) {
    let data = new schemaModels[collectionName];
    for (let key in inserObject) {
      data[key] = inserObject[key];
    }
    data.save(function (err, data, count) {
      if (err) reject(err);
      resolve(data);
    });
  })
}

function read (collectionName) {
  return schemaModels[collectionName].find().sort('time'); //可以加正負號 -號是小的在前
}

function update (collectionName, id, inserObject) {
  return new Promise(function (resolve, reject) {
    inserObject.time = moment().valueOf();
    schemaModels[collectionName].findById(id, function (err, data) {
      for (let key in inserObject) {
        data[key] = inserObject[key];
      }
      data.save(function (err, todo, count) {
        if (err) reject(err);
        resolve(data);
      });
    })
  })
}

function destroy (collectionName, id) {
  return new Promise(function (resolve, reject) {
    schemaModels[collectionName].findById(id, function (err, data) {
      data.remove(function (err, data) {
        if (err) return reject(err);
        resolve(data);
      });
    });
  });
};

mongoose.connect('mongodb+srv://asd123753951:XVjAIyz5SKKdS4ku@ithelp.eb4bso5.mongodb.net/?retryWrites=true&w=majority&appName=ItHelp', { 
  // useNewUrlParser: true, 
  // useUnifiedTopology: true,

});

// mongoose.connect('mongodb+srv://asd123753951:XVjAIyz5SKKdS4ku@ithelp.eb4bso5.mongodb.net/?retryWrites=true&w=majority&appName=ItHelp', {
//   // 已移除 useNewUrlParser 和 useUnifiedTopology
//   useFindAndModify: false,
//   useCreateIndex: true
// }).then(() => {
//   console.log('MongoDB connected');
// }).catch(err => {
//   console.log('MongoDB connection error:', err);
// });

module.exports = {
  create,
  read,
  update,
  destroy
};