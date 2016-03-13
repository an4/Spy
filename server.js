var express = require('express');

var app = express();

app.enable("jsonp callback");

express.static.mime['jsonp'] = 'application/javascript';

app.use(express.static(__dirname + '/Timing'));

/** UNICORNS */
app.use('/node_modules',  express.static(__dirname + '/node_modules'));

app.get('*', function(req, res){
  res.redirect('/index.html');
});

var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log('App listening on port ' + port);
});
