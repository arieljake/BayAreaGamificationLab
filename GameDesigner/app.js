/**
 * Module dependencies.
 */

var express = require('express')
	, routes = require('./routes')
	, user = require('./routes/user')
	, http = require('http')
	, path = require('path')
	, fs = require('fs');

var app = express();

app.configure(function ()
{
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function ()
{
	app.use(express.errorHandler());
});

app.get('/:viewId', function (req, res)
{
	res.render("simpleView", {title: req.params.viewId, pageScript: "/js/pages/" + req.params.viewId + "/index.js", params: req.query})
});

app.post('/data/:fileName', function (req, res)
{
	var fileName = req.params["fileName"];
	var fileLoc = __dirname + "/public/data/" + fileName;

	fs.writeFile(fileLoc, JSON.stringify(req.body), function (err)
	{
		if (err)
			res.send({result: "error"});
		else
			res.send({result: "saved"});
	})
})

http.createServer(app).listen(app.get('port'), function ()
{
	console.log("Express server listening on port " + app.get('port'));
});
