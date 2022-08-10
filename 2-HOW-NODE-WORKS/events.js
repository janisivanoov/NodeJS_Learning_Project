const EventEmitter = require('events');
const http = require('http');
const url = require('url');

class Sales extends EventEmitter {
    constructor() {
        super();
    }
}

const myEmitter = new Sales();

myEmitter.on('newSale', () => {
    console.log('There was a new sale');
});

myEmitter.on('newSale', () => {
    console.log('Costumer name: Janis');
});

myEmitter.on('newSale', () => {
    console.log('There are now ${stock} items left in stock.');
});

myEmitter.emit('newSale', 9);


const server = http.createServer();

server.on('request', (req, res) => {
    console.log('Request received');
    console.log(req.url)
    res.end('Request received');
});

server.on('request', (req, res) => {
    res.end('Another request');
});

server.on('close', () => {
    res.end('Server closed');
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Waiting for requests');
});