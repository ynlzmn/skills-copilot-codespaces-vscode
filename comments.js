// create web server
// to run: node comments.js
// to test: curl -d "comment=comment" http://localhost:3000/comments
// to test: curl http://localhost:3000/comments
// to test: curl -X DELETE http://localhost:3000/comments/1
// to test: curl -X PUT -d "comment=comment" http://localhost:3000/comments/1
// to test: curl http://localhost:3000/comments/1

var http = require('http');
var url = require('url');
var items = [];

var server = http.createServer(function(req, res) {
  console.log(req.method);
  switch (req.method) {
    case 'POST':
      var item = '';
      req.setEncoding('utf8');
      req.on('data', function(chunk) {
        item += chunk;
      });
      req.on('end', function() {
        items.push(item);
        res.end('OK\n');
      });
      break;
    case 'GET':
      var body = items.map(function(item, i) {
        return i + ') ' + item;
      }).join('\n');
      res.setHeader('Content-Length', Buffer.byteLength(body));
      res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
      res.end(body);
      break;
    case 'DELETE':
      var path = url.parse(req.url).pathname;
      var i = parseInt(path.slice(1), 10);
      if (isNaN(i)) {
        res.statusCode = 400;
        res.end('Invalid item id');
      } else if (!items[i]) {
        res.statusCode = 404;
        res.end('Item not found');
      } else {
        items.splice(i, 1);
        res.end('OK\n');
      }
      break;
    case 'PUT':
      var path = url.parse(req.url).pathname;
      var i = parseInt(path.slice(1), 10);
      if (isNaN(i)) {
        res.statusCode = 400;
        res.end('Invalid item id');
      } else if (!items[i]) {
        res.statusCode = 404;
        res.end('Item not found');
      } else {
        var item = '';
        req.setEncoding('utf8');
        req.on('data', function(chunk) {
          item += chunk;
        });
        req.on('end', function() {
          items[i] = item;
          res.end