var TwitterPackage = require('twitter');
var elasticsearch = require('elasticsearch');
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7000; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
var client = new elasticsearch.Client({
         host: 'search-twitterstream-ywbxov7tqypovgqglnjcuer4oq.us-west-2.es.amazonaws.com',
         log: 'trace'
         });
var secret = {
  consumer_key: 'your-consumer_key',
  consumer_secret: 'your-consumer_secret',
  access_token_key: 'your-access_token_key',
  access_token_secret: 'your-access_token_secret'
}
var cnt=0


var Twitter = new TwitterPackage(secret);
Twitter.stream('statuses/filter', {track: '#MUFC,#donaldtrump,#hilaryclinton,#APPLE,#iphone,#NBA,#halamadrid,#knicks,#saferindia,#fifa,#gunners,#worldseries,#narendraModi,#omg,#NYC,#happydiwali'}, function(stream) {
  stream.on('data', function(tweet) {
  	//console.log(tweet.place)
  	//console.log(tweet.user.location)
    //console.log(tweet.place.bounding_box.coordinates[0][0][0]);

    //console.log(tweet.place.bounding_box.coordinates[0][0][1]);
    console.log(tweet.place)
    if(tweet.place!=null){
    var esinp={"username":tweet.user.screen_name ,"text": tweet.text, "latitude": tweet.place.bounding_box.coordinates[0][0][1], "longitude": tweet.place.bounding_box.coordinates[0][0][0]}
    console.log(tweet.place==null)
    
	sleep(1000)
  client.index({
  index: 'twittmaps',
  type: 'twittmaps',
  id: tweet.id,
  body: esinp
}, function (error, response) {

});

  console.log("gotcha")
}

  });
  
  
  stream.on('error', function(error) {
    console.log(error);
  });
});