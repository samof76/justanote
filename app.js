
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , notes = require('./routes/notes')
  , mongoose = require('mongoose');

var app = express();

var port = process.env.VMC_APP_PORT || 3000;
var host = process.env.VCAP_APP_HOST || "localhost";

var vcapServices = process.env.VCAP_SERVICES ? JSON.parse(process.env.VCAP_SERVICES): null;

var mongoose_connect = null;

if (vcapServices) {
  mongo = vcapServices['mongodb-2.0'][0]['credentials'];
  mongoose_connect = mongoose.connect("mongodb://"+mongo['username']+":"+mongo['password']+"@"+mongo['host']+":"+mongo["port"]+"/"+mongo["db"])
} else {
  mongoose_connect = mongoose.connect("mongodb://localhost/justanote");
}

//svar mongoose = mongoose.connect("mongodb://localhost/justanote");

app.configure(function(){
  app.set('port', port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.all('*', function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Content-Type", "application/json");
  next();
});


app.get('/', routes.index);
app.get('/users', user.list);

app.get('/notes', notes.list);
app.post('/notes', notes.new);
app.get('/notes/:id', notes.note);
app.post('/notes/:id', notes.update);



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
