var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));

// /** UNICORNS */
// app.use('/node_modules',  express.static(__dirname + '/node_modules'));

app.get('/', function(req, res){
  res.redirect('/index.html');
});

var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log('App listening on port ' + port);
});
