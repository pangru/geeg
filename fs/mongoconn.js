/*
var mongoose = require('mongoose');
mongoose.connect('monodb://127.0.0.1/geeg');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',function () {
});  */

var mongo = require('mongodb');
var Db = mongo.Db;
var Grid = mongo.Grid;

Db.connect("mongodb://127.0.0.1:27017/geegDb", function (err, db) {
    if (err) return console.log(err);

    var grid = new Grid(db, 'fs');
    var buffer = new Buffer("Hello world");
    grid.put(buffer, {metadata: { category: 'text'}, content_type: 'text'}, function (err, fileInfo) {
        if (!err) {
            console.log("Finished writing file to Mongo");
        }
    });
});
