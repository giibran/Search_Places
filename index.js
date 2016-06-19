'use strict';

const fs = require("fs");
const request = require('superagent');
const csvWriter = require('csv-write-stream');

const location = '-33.8670,151.1957';
const search = 'cruise';

const header = ["hello", "foo"];
const body = [['world', 'bar']];

const getPlaces = (search, location) => {
request
   .get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=500&types=food&name=${search}&key=AIzaSyBUTi_Mn7gKH2cAyQ3lv4LZxDYsD7Vj8KE`)
   .end(function(error, res){
    if (error) {
      console.log(error);
    }
    const response = JSON.parse(res.text);
    console.log(response.results);
   });
}


const csvCreator = (headers, rows) => {
  const writer = csvWriter({ headers: headers});
  writer.pipe(fs.createWriteStream('places.csv'));
  rows.map((row) => {
    writer.write(row);
  });
};



getPlaces(search, location);
