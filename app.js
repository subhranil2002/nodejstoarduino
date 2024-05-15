var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('dashboard.html');

var SerialPort = require('serialport');
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
    delimiter: '\r\n'
});

var port = new SerialPort('/dev/cu.usbmodem11201', {
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

port.pipe(parser);

var server = http.createServer(function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.end(index);
});

var io = require('socket.io')(server); // Corrected line to create socket.io server

io.on('connection', function(socket) {
    console.log('Node is listening to port');
});

parser.on('data', function(data) {
    console.log('Received data from port: ' + data);
    io.emit('data', data);
});

server.listen(3001, function() {
    console.log('Server is running on port 3000');
});