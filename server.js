'use strict'
// var http = require("http");

// var fs = require('fs');
// var path = require('path');
// var mime = require('mime');

// function send404(response) {
//   response.writeHead(404, {"Content-type" : "text/plain"});
//   response.write("Error 404: resource not found");
//   response.end();
// }

// function sendPage(response, filePath, fileContents) {
//   response.writeHead(200, {"Content-type" : mime.lookup(path.basename(filePath))});
//   response.end(fileContents);
// }

// function serverWorking(response, absPath) {
//   fs.exists(absPath, function(exists) {
//     if (exists) {
//       fs.readFile(absPath, function(err, data) {
//         if (err) {
//           send404(response)
//         } else {
//           sendPage(response, absPath, data);
//         }
//       });
//     } else {
//       send404(response);
//     }
//   });
// }

// var server = http.createServer(function(request, response) {
//   var filePath = false;

//   response.writeHead(200, {"Content-Type": "text/plain"});

//   if (request.url == '/') {
//     filePath = "/index.html";
//   } else {
//     filePath = request.url;
//   }

//   var absPath = "./" + filePath;

//   console.log('WOW I AM RUNNING')
//   serverWorking(response, absPath);
  
// }).listen(process.env.PORT || 3001);

////////////////////////////////////
require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.static('./public'));

app.get('/location', (request, response) => {
  const geoData = require('./data/geo.json');
  const city = request.query.data;
  const locationData = new Location(city, geoData);
  response.send(locationData);
});

//Building a path to /weather
app.get('/weather', (request, response) => {
  const wetData = require('./data/darksky.json');
  // const city = request.query.data;
  // const weatherData = new Forecast(wetData);
  let arr = [];
  wetData.daily.data.forEach(value => {
    let temp = new Forecast(value);
    arr.push(temp);
      // this.forecast = value.summary;
      // this.time = value.time;
      // arr.push(this);
  });
  response.send(arr);
});

function Forecast(each){
  let temp = new Date((each.time)*1000);
  let tempScr = temp.toUTCString();
  this.forecast = each.summary;
  this.time = tempScr;
}

// function Forecast(wetData){
//   this.forecast = wetData.daily.data[i].summary;
//   this.time = wetData.daily.data[i].time;
// }

function Location(city, geoData){
  this.search_query = city;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}

app.listen(PORT, () =>{
  console.log(`listening on PORT ${PORT}`);
});
