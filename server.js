'use strict'

require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.static('./public'));

//Creating Error Function//
function Error(status, responseText) {
  this.status = status;
  this.responseText = responseText;
}

//Building path to /location data
app.get('/location', (request, response) => {
  const geoData = require('./data/geo.json');
  const city = request.query.data;
  const locationData = new Location(city, geoData);
  if(request.query.data === undefined){
    response.send( new Error(500, "Sorry, something went wrong!") );
  } else{
  response.send(locationData);
  }
});

//Building a path to /weather
app.get('/weather', (request, response) => {
  const wetData = require('./data/darksky.json');
  if (request.query.data === undefined) {
    response.send( new Error(500, "Sorry, something went wrong!") );
  } else {
    let arr = [];
    wetData.daily.data.forEach(value => {
      let temp = new Forecast(value);
      arr.push(temp);
    });
    response.send(arr);
  }
});

function Forecast(each) {
  let temp = new Date((each.time) * 1000);
  let tempScr = temp.toUTCString();
  this.forecast = each.summary;
  this.time = tempScr;
}

function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}

app.listen(PORT, () => {
  console.log(`listening on PORT ${PORT}`);
});
