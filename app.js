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

  var bgnr = req.body.bgnr.digitsOnly(),
      orgnr = req.body.orgnr.digitsOnly();

  var url = "http://bgc.se/sok-bg-nr/?bgnr=" + bgnr + "&orgnr=" + orgnr;
  request(url, function(error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);

      var resBgnr = $('.result-container')
          .first()
          .find('li.subtitle:contains("Bankgironummer")')
          .next('li').text().digitsOnly();

      var resOrgnr = $('.result-container')
          .first()
          .find('li.subtitle:contains("Organisationsnummer")')
          .next('li').text().digitsOnly();

      var response = {match: false};
      if (bgnr === resBgnr && orgnr === resOrgnr) {
        response.match = true;
      }

      res.end(JSON.stringify(response));
    }
  });
});

String.prototype.digitsOnly = function() {
  return this.replace(/[^0-9.]/g, '');
}
