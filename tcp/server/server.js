var net = require('net');
var protocol = require('pomelo-protocol');
var TcpSocket = require('./tcpsocket');
var Package = protocol.Package;
var Message = protocol.Message;


var start = function(host, port) {
	this.host = host;
	this.port = port;
	this.server = net.createServer();
	this.server.listen(this.port);

	this.server.on('connection', function(socket) {
    console.log('on connection');
		var tcpsocket = new TcpSocket(socket, {headSize: 4,
                                         headHandler: headHandler});
		tcpsocket.on('message', function(msg) {
    	if(msg) {
      	msg = Package.decode(msg);
      	handle(msg);
    	}
  	});
	});
};

var handle = function(msg) {
  msg = Message.decode(msg.body);
  msg.body = JSON.parse(msg.body.toString('utf8'));
  console.error('msg: %j', msg);
};

var headHandler = function(headBuffer) {
  var len = 0;
  for(var i=1; i<4; i++) {
    if(i > 1) {
      len <<= 8;
    }
    len += headBuffer.readUInt8(i);
  }
  return len;
};

start('127.0.0.1', 3005);