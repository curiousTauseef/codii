
/**
 * Module dependencies.
 */

var express = require('express');
var codi = require('./routes/codi');
var http = require('http');
var path = require('path');
var orm = require('orm');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(orm.express(process.env.DATABASE_URL || "sqlite://database.db", {
	define: function(db, models, next) {
		models.codi = db.define("codi", {
			"content": "text"
		});

		db.sync();

		next();
	}
}));

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', codi.new);
app.get('/:id', codi.get);
app.post('/', codi.create);
app.post('/:id', codi.update);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
