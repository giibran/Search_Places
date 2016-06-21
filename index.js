'use strict';

const fs = require("fs");
const request = require('superagent');
const csvWriter = require('csv-write-stream');
const async = require('async');
const config = require('./config');

const args = process.argv.slice(2);
const location = args[1] || '20.686006,-103.368966';
const search = args[0] || 'doctor';
const RADIUS = '1000';
const TYPES = 'all';
const KEY = config.google_key;

const header = ["name", "address", 'celphone', 'google_url', 'website'];

const getPlaces = (search, location, callback) => {
  request
   .get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${RADIUS}&types=${TYPES}&name=${search}&key=${KEY}`)
   .end(function(error, res){
    if (error) {
      console.log(error);
    }
    const response = JSON.parse(res.text);
    callback(null, response.results);
   });
}

const createRows = (places, callback) => {
  async.mapSeries(places, (place, next) => getPlaceDetail(place, place.name, next), callback);
};

const getPlaceDetail = (place, placeName, callback) => {
  request
   .get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${place.place_id}&key=AIzaSyBUTi_Mn7gKH2cAyQ3lv4LZxDYsD7Vj8KE`)
   .end((err, res) => handlePlaceDetailResponse(err, res, placeName, callback));
};

const handlePlaceDetailResponse = (error, res, placeName, callback) => {
  if (error) {
    console.log(error);
  }
  const response = JSON.parse(res.text);
  callback(null, parseDetail(response.result, placeName));
};

const parseDetail = (item, placeName) => {
  return [placeName, item.formatted_address, item.international_phone_number, item.url, item.website];
};

const csvCreator = (headers, rows, callback) => {
  const writer = csvWriter({ headers: headers});
  writer.pipe(fs.createWriteStream('places.csv'));
  rows.map((row) => {
    writer.write(row);
  });
  callback();
};

async.waterfall([
  (next) => getPlaces(search, location, next),
  createRows,
  (rows, next) => csvCreator(header, rows, next)
], function (error, result) {
  if (error) {
    console.log(error)
  }
});
