var express = require('express'),
logger = require('morgan'),
bodyParser = require('body-parser'),
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

// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({type: 'application/json'}));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/', function(req, res) {
  console.log(req.body);

  var bgnr = req.body.bgnr.replace(/[^0-9.]/g, ''),
      orgnr = req.body.replace(/[^0-9.]/g, '');

  matchBgOrgnr("http://bgc.se/sok-bg-nr/?bgnr=" + bgnr + "&orgnr=" + orgnr);

  res.end(JSON.stringify(req.body));
});

function matchBgOrgnr(url) {
  request(url, function(error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);

    }
  });
}
