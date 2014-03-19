// index.js
var express = require("express");
var logfmt = require("logfmt");
var app = express(),
	fs = require('fs');

app.use(logfmt.requestLogger());


app.configure( function() { 
  app.use('/js', express.static(__dirname + '/js')); 
  console.log("Express configured. Listening on port 5000");
});


// respond to web GET requests with the index.html page.
// this is how you serve a file that's not in a static directory:
app.get('/', function (request, response) {
   response.sendfile('index.html');
});

// function for serving index.html, or index. anything:
app.get('/index*', function (request, response) {
   response.sendfile('index.html');
});

app.get('/data', function (request, response) {
	response.sendfile('superpoops.json');
});

app.get('/logdata/name/:name/times/:times/lat/:lat/long/:long', function(request,response) {
	var clientName  = request.params.name;
	var clientTimes  = request.params.times;
	var clientLat  = request.params.lat;
	var clientLong  = request.params.long;
	var myIP = request.ip;    //get IP address


	var myData = {
		name: clientName,
		ip: myIP,
		time: parseInt(clientTimes),
	  	lat: parseFloat(clientLat),
	  	lon: parseFloat(clientLong)
	};
	
	var outputFilename = './superpoops.json';
	var data = JSON.stringify(myData, null, 4) + "," + '\r';

	fs.appendFile(outputFilename, data, function(err) {
    	if(err) {
      		console.log(err);
      		response.send(err); //prints error in front end console
    	} else {
      		console.log("JSON saved to " + outputFilename);
      		response.send(data); //prints data in front end console
    	}
	});
});



var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});

