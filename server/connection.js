var net = require('net');
var stream = require('stream');
var Transform = stream.Transform;
var console = require('./global')(__filename);
var express = require('../node_modules/express');
var request = require('../node_modules/request');

var logger = require('../lib/logger');
var glog = logger.get('connection');
var app = express();
var tcpServer;

var socketMap = {};

var decodeHeader = function (buffer) {
    var header = {
        textLength : 0 
    };

    header.textLength = buffer.readInt32BE(0);
    return { header : header, rest : buffer.slice(4) };
};

var packet = {
    HEADER_SIZE : 4,
    decodeHeader : decodeHeader
};

var createPacket = function (data) {
    var len = new Buffer(4);
    var text = new Buffer(JSON.stringify(data));

    len.writeUInt32BE(text.length, 0);

    var arr = [len, text];
    return Buffer.concat(arr);
    
};

var decodePacket = function (packet) {
    var len = packet.readInt32BE(0);
    var str = packet.toString('utf8', 4, 4 + len);
    var text = JSON.parse(packet.toString('utf8', 4, 4 + len));

    return text;
};

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.post('/', function (req, res) {
    glog.d('device login ' + req.body.token, 'toMe');
    console.log(req.body.token);
    request('https://www.googleapis.com/oauth2/v2/userinfo?access_token='
        + req.body.token, function (err, response, body) {
            socketMap[req.body.token] = {
                info : body,
                socket : undefined,
                device_id : undefined,
                timerid : undefined,
                logger : undefined
            };
            glog.d(body);
            res.send({ session : req.body.token });
    });
});

var setTimer = function (socket) {
    return setInterval((function () {
        var sock = socket;
        return function () {
            socketlog(socket, 'ping', 'fromMe'); 
            sock.write(createPacket({ cmd : 0, msg : 'ping' }));
        };
    })(), 60 * 10 *  1000);
};

var setupSocket = function (obj, socket, packet) {

    socket._ump_session = packet.textdata.session;
    socket._ump_timerid = setTimer(socket); 
    
    obj.socket = socket;
    obj.device_id = packet.textdata.device_id;
    obj.logger = logger.get(obj.device_id); 

    obj.logger.d('TCP login', 'toMe');
};

function PancoldA(options) {
    if(!(this instanceof PancoldA)) {
        return new PancoldA(options);
    }

    Transform.call(this, options);
    this.header = null;
    this.textdata = null;
    this.binary = null;
    this._hDone = false;
    this._tDone = false;
    this._extraChunk = [];

};

PancoldA.prototype = Object.create(Transform.prototype, { constructor: { value : PancoldA }});

PancoldA.prototype._transform = function (chunk, encoding, done) {
    var decoded;
    var text;
    var buffer;
    while(true) {
        if(this._extraChunk.length) {
            this._extraChunk.push(chunk);
            chunk = Buffer.concat(this._extraChunk);
            this._extraChunk = [];
        }
        if(!this._hDone) {
            if(chunk.length < packet.HEADER_SIZE) {
                this._extraChunk.push(chunk);
                break;
            }
            else {
                decoded = packet.decodeHeader(chunk);
                this.header = decoded.header;
                chunk = decoded.rest;
                this._hDone = true;
                // done now go back the the beginning of the loop
            }
        }
        else {
            // read textdata first
            if(chunk.length < this.header.textLength) {
                this._extraChunk.push(chunk);
                break;
            }
            else {
                if(this.header.textLength > 0) {
                    text = chunk.slice(0, this.header.textLength);
                    try {
                        this.textdata = JSON.parse(text.toString('utf-8'));
                    }
                    catch (e) {
                        console.log(e);
                    }
                    chunk = chunk.slice(this.header.textLength);
                    this._hDone = false;
                    this._tDone = false;
                    this.emit('packet', {header : this.header, textdata : this.textdata });
                    this.header = null;
                    this.textdata = null;
                    this.binary = null;
                }
                this._tDone = true;
            }
        }
    }
    done();
};

var processPing = function (data) {
    var obj = socketMap[data.session];
    obj.logger.d('ping', 'toMe');
};

var processWhoAreYou = function (socket, packet) {
    var obj = socketMap[packet.textdata.session];    
    if(obj) {
        // something went wrong and socket has been changed
        if(obj.socket) {
            clearInterval(socket._ump_timerid);
        }
        setupSocket(obj, socket, packet);
    }
    else {
        glog.d('someone did not login ' + packet.textdata.device_id, 'toMe');
        socket.write(createPacket({ cmd : -1, msg : 'you did not log in' }));
        socket.end();
    }
};

tcpServer = net.createServer(function (socket) {
    glog.d('connection established');
    setTimeout(function () { glog.d('whoareyou?', 'fromMe'); socket.write(createPacket({ cmd : 1, msg : 'whoareyou?' })); }, 1000); 
    var parser = new PancoldA();
    
    parser.on('packet', function (packet) {
        switch(packet.textdata.cmd) {
            case 0:
                processPing(packet.textdata);
            break;
            case 1:
                processWhoAreYou(socket, packet);
            break;
            default:
            break;  
        };
    });

    socket.on('timeout', function () {
        socketlog(socket, 'timeout');      
    });

    socket.on('error', function (err) {
        socketlog(socket, err);
        socket.end();
    });

    socket.on('close', function (had_error) {
        socketlog(socket, 'close event called ' + had_error);
       var obj = socketMap[socket._ump_session];
       if(obj) {
           glog.d('clearning interval');
           clearInterval(socket._ump_timerid);
           obj.socket = null;
       //    delete socketMap[socket._ump_session];
        }
    });

    socket.on('end', function () {
        socketlog(socket, 'end event called');
    });

    socket.pipe(parser);
});

var socketlog = function (socket, msg, dir) {
    if(socket._ump_session) {
        var obj = socketMap[socket._ump_session];
        if(obj) {
            var log = socketMap[socket._ump_session].logger;
            if(log) log.d(msg, dir);
        }
        else {
            console.log(msg);
        }
    }
};

tcpServer.listen(9998);
app.listen(9999);
