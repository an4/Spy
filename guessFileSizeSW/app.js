var express = require('express');

var app = express();

var path =  require("path");

app.use(express.static(__dirname + '/'));
app.use('/node_modules',  express.static(__dirname + '/node_modules'));

var router = express.Router();

router.get('/', function(req, res) {
    res.sendFile('/index.html');
});

router.get('/main', function(req, res) {
    res.sendFile(path.join(__dirname, 'main.html'));
});

app.use('/', router);

var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log('App listening on port ' + port);
});
