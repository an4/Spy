var express = require('express');
var app = express();

app.use(express.static(__dirname + '/'));

// app.get('/', function(req, res){
//   res.redirect('/loadTime.html');
// });

var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log('App listening on port ' + port);
});
