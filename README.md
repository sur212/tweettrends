# README


Twitter-extractor is a script that fetches data from twitter and dumps it to the elasticsearch instance in aws.


app/controllers/map_controller 	-> 	index() gets data from the elasticsearch instance processes the data(extracts latitude and longitude from the response) sends the processes data to index.html

app/views/maps/index.html 		-> 	initMap() gets the processed data and displays latitudes and longitudes on the Google Maps

In index.html, there are buttons which tells the tweets that are collected from the data source. On clicking a particular link, tweets related to that tweet is fetched and displayed on the maps.

In addition to this, there is a search bar where you can search for random strings. If there are results for that string, then results will be displayed on the mpas. 
