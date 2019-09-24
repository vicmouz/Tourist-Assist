var http = require('http');
 
module.exports = {
  get: function(callback) {
    var req = http.request({
      hostname: 'jsonplaceholder.typicode.com',
      path: '/posts/1'
    }, function(response) {
      var data = '';
      response.on('data', function(chunk) {
        data += chunk;
      });
 
      response.on('end', function() {
        callback(null, JSON.parse(data));
      });
    });
 
    req.end();
  },
 
  post: function(data, callback) {
    var req = http.request({
      hostname: 'jsonplaceholder.typicode.com',
      path: '/posts',
      method: 'POST'
    }, function(response) {
      var data = '';
      response.on('data', function(chunk) {
        data += chunk;
      });
 
      response.on('end', function() {
        callback(null, JSON.parse(data));
      });
    });
 
    req.write(JSON.stringify(data));
 
    req.end();
  }
};