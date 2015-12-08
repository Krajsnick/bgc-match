var express = require('express'),
logger = require('morgan'),
bodyParser = require('body-parser'),
request = require('request'),
cheerio = require('cheerio'),
basicAuth = require('basic-auth'),
app = express();

var listener = app.listen(3000, function() {
  console.log("bgc-match server started on port " + listener.address().port);
});

// Logger config
if (process.env.NODE_ENV == 'production')
  app.use(logger('short'));
else
  app.use(logger('dev'));

// Basic auth
var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === 'roffe' && user.pass === 'kaff3muggen') {
    return next();
  } else {
    return unauthorized(res);
  };
};

// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({type: 'application/json'}));
app.use(auth, express.static(__dirname + '/public'));

app.get('/', auth, function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/', auth, function(req, res) {
  var response = {match: false};

  var bgnr = req.body.bgnr,
      orgnr = req.body.orgnr;

  if (bgnr && orgnr) {
    bgnr = bgnr.digitsOnly();
    orgnr = orgnr.digitsOnly();
  } else {
    res.send(JSON.stringify(response));
    return;
  }

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

      if (bgnr === resBgnr && orgnr === resOrgnr) {
        response.match = true;
      }

      res.send(JSON.stringify(response));
    }
  });
});

String.prototype.digitsOnly = function() {
  return this.replace(/[^0-9.]/g, '');
}
