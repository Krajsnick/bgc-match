var express = require('express'),
logger = require('morgan'),
request = require('request'),
cheerio = require('cheerio'),
app = express();

var listener = app.listen(3000, function() {
  console.log("bgc-match server started on port " + listener.address().port);
});

// Logger config
if (process.env.NODE_ENV == 'production')
  app.use(logger('short'));
else
  app.use(logger('dev'));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
