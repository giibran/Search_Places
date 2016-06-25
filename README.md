Search places
===================

This is a script that just get google places and put in a csv file.

Config
-------------
1. Clone the repo:
`$ git clone git@github.com:giibran/Search_Places.git`

2. cd to search-places folder
`$ cd search-places`

3. Install npm modules
`npm install`

4. Inside config.js file update the google_key variable

5. Run index file using two parameters, first parameter is the text to search and second is the location with the next format '20.686006,-103.368966' example:
`$ node index.js restaurantes '20.686006,-103.368966'
`
6. A places.csv file will be created after srcript is done.


NOTE:
Actually the google place api just give 20 results by search
