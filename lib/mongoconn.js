var mongo = require('mongodb');
var DB = mongo.Db;
var Grid = mongo.Grid;

module.exports = (function () {
  var init = function () {
    console.log("init()");
    DB.connect("mongodb://127.0.0.1:27017/geegDb", function (err, db) {
      if (err) return console.log(err);

      var grid = new Grid(db, 'fs');
      var buffer = new Buffer("Hello world");
      grid.put(buffer, {metadata: { category: 'text'}, content_type: 'text'}, function (err, fileInfo) {
        if (!err) {
          console.log("Finished writing file to Mongo");
        }
      });
    });
  };

  var insert = function (file_name, type, path, callback) {
    console.log("insert()");
    var metadata = {
      metadata : { category: type },
      content_type: type  
    };

    DB.connect("mongodb://127.0.0.1:27017/geegDb", function (err, db) {
      if (err)  console.log(err);

      var grid = new Grid(db, 'fs');
      grid.put(file_name, metadata, function (err, fileInfo) {
        if (err) console.log("mongoconn.insert()", err);
        callback(err);
      });
    });
  };

  return {
    init: init,
    insert: insert
  };
})();