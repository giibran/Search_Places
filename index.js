'use strict';

const fs = require("fs");
const request = require('superagent');
const csvWriter = require('csv-write-stream');
const async = require('async');

const location = '20.686006,-103.368966';
const search = 'doctor';

const header = ["hello", "foo"];
const body = [['world', 'bar']];

const getPlaces = (search, location, callback) => {
  request
   .get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=5000&types=all&name=${search}&key=AIzaSyBUTi_Mn7gKH2cAyQ3lv4LZxDYsD7Vj8KE`)
   .end(function(error, res){
    if (error) {
      console.log(error);
    }
    const response = JSON.parse(res.text);
    callback(null, response.results);
   });
}

const getPlaceDetail = (place, callback) => {
  request
   .get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${place.place_id}&key=AIzaSyBUTi_Mn7gKH2cAyQ3lv4LZxDYsD7Vj8KE`)
   .end(function(error, res){
    if (error || res.status == 'INVALID_REQUEST') {
      console.log(error);
    }
    const response = JSON.parse(res.text);
    callback(null, response);
   });
}

const createRows = (placesInArray, callback) => {
  var rows = [];
  async.eachSeries(placesInArray, (item, callback) => {
    async.waterfall([
      async.apply(getPlaceDetail, item),
      algo
    ]);
  });
  callback(null, rows)
}

const addRowItem = (item, rows, callback) => {
  rows.push([item.formatted_address, item.international_phone_number, item.url, item.website])
}

const placesToArray = (places, callback) => {
  let placesInArray = [];
  for(var place in places){
    placesInArray.push(places[place])
  }
  callback(null, placesInArray)
}

const csvCreator = (headers, rows) => {
  const writer = csvWriter({ headers: headers});
  writer.pipe(fs.createWriteStream('places.csv'));
  rows.map((row) => {
    writer.write(row);
  });
};

const algo = (data, callback) => {
  console.log(data)
}

async.waterfall([
  async.apply(getPlaces, search, location),
  placesToArray,
  createRows,
  algo
], function (error, result) {
    console.log(error)
});
