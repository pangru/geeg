var fs = require('fs');
var express = require("express");
var querystring = require("querystring");

var db = require('./lib/dbconn');

var app = express();
var port = 80;
var html_path = __dirname + '/html';

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
//app.use(express.session());
app.use(app.router);
app.use(express.static(__dirname + '/html'));
app.use(express.static(__dirname + '/html/images'));
app.use(express.static(__dirname + '/html/album'));

app.get('/', function (req, res){
  var html = fs.readFileSync(html_path + "/home.html");
  res.send(html);
});

app.get('/logout', function (req, res) {
  console.log('logout');
  res.send(200);
});

app.post('/register', function (req, res) {
  var info = {
    name: (req.body.fullname || req.body.name),
    email: req.body.email,
    password: req.body.password,
    isSns: (req.body.isSNS && 0)
  };

  console.log('register ', info); 

  db.register(info, function (err, result) {
    console.log('register result ', err, result);
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.post('/login', function (req, res) {
  var info = {
    email: req.body.email,
    password: req.body.password
  };
console.log(info);
  db.login(info, function (err, data) {
    console.log('login server %j', data);
    res.send(data);
  });
});

app.get('/notice', function (req, res) {
console.log('get  /notice', req.query.count);
  var params = {
    nid: req.query.nid, 
    count: req.query.count
  }

  db.notice(params, function (err, data) {
    console.log('notice ' + data.length);
    res.send(data);
  });
});

app.post('/notice', function (req, res) {
  console.log(req.body.cnts);
  var info = {
    writer_id: req.body.uid,
    title: req.body.title,
    body: req.body.cnts,
    create_date: Date.now()
  };

  db.writeNotice(info, function (err) {
    console.log('db notice insert');
    if (!err) {
      res.send();
    }
  });
});

app.get('/calender', function (req, res) {
  db.calendar(req.query.count, function (err, data){
    console.log('event calendar ', data.length);
    res.send(data);
  });
});

(function() { 
  app.listen(port);
  console.log("listening %s", port);

  db.open();
})();