var mongo = require('mongodb');
var Db = mongo.Db;
var Grid = mongo.Grid;

var express = require('express');
var fs = express();
var port = 9000;

fs.use(express.logger('dev'));
fs.use(express.cookieParser());
fs.use(express.bodyParser({uploadDir: __dirname + '/upload'}));
fs.use(express.methodOverride());
fs.use(express.urlencoded());
fs.use(fs.router);

Db.connect("mongodb://127.0.0.1:27017/geegDb", function (err, db) {
    if (err) return console.log(err);

    var grid = new Grid(db, 'fs');

    var buffer = new Buffer("Hello world");
    grid.put(buffer, {metadata: { category: 'text'}, content_type: 'text'}, function (err, fileInfo) {
        if (!err) {
            console.log("Finished writing file to Mongo");
            console.log("fileInfo :", fileInfo);
        }
    });
});

fs.post('/upload_grid', function (req, res) {
console.log('input upload');
    var file = req.files.attach_file;
    var name = file.name;
    var type = file.type;
    var path = file.path;

    console.log('/upload_grid', file);
});

(function () {
    console.log('file server Listening ', port);
    fs.listen(port);    
})();
