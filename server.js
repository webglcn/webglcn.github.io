// Load the http module to create an http server.
var http = require('http');
var url = require('url');
var express = require('express');
var fs = require('fs');
var path = require('path');

// Configure our HTTP server to respond with Hello World to all requests.
var app = express();
app.use(express.static(__dirname + "/"));
var server = http.createServer(app);

var getExtension = function(filename) {
    var ext = path.extname(filename || '').split('.');
    return ext[ext.length - 1];
}

app.get("/:id", function (request, response) {
    var filepath = path.join(__dirname, request.params.id);
    fs.readFile(filepath, "binary", function(error, content) {
        if (error) {
            response.writeHead(500);
            response.end();
        } else {
            var ext = getExtension(filepath);

            switch (ext) {
                case "html":
                case "htm":
                    response.writeHead(200, {
                        'Content-Type': 'text/html',
                        'Access-Control-Allow-Origin': '*'
                    });
                    break;
                case "css":
                    response.writeHead(200, {
                        'Content-Type': 'text/css',
                        'Access-Control-Allow-Origin': '*'
                    });
                    break;
                case "js":
                    response.writeHead(200, {
                        'Content-Type': 'text/javascript',
                        'Access-Control-Allow-Origin': '*'
                    });
                    break;
                default:
                    httpResponse.writeHead(200, {
                        'Content-Type': 'text/plain',
                        'Access-Control-Allow-Origin': '*'
                    });
                    break;
            }

            response.write(content, "binary");
            response.end();
        }
    });
});

server.listen(8080);

console.log("Server running at http://127.0.0.1:8080/");
