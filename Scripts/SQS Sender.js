var AWS = require('aws-sdk');

AWS.config.update({accessKeyId: 'type access key', secretAccessKey: 'type key'});

var sqs = new AWS.SQS({region:'us-east-1'}); 

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
         host: 'put elastic search url',
         log: 'trace'
         });
var secret = {
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
}
var cnt=0

var Twitter = new TwitterPackage(secret);
Twitter.stream('statuses/filter', {track: '#mufc,#lfc,#knicks,#donaldtrump,#nba'}, function(stream) {
  stream.on('data', function(tweet) {
   // console.log(tweet.text)
    //console.log(tweet.user.location)
    //console.log(tweet.place.bounding_box.coordinates[0][0][0]);

    //console.log(tweet.place.bounding_box.coordinates[0][0][1]);
   if(tweet.lang=='en'){
    if(tweet.place!=null){
    var esinp={"id":tweet.id, "username":tweet.user.screen_name ,"text": tweet.text, "latitude": tweet.place.bounding_box.coordinates[0][0][1], "longitude": tweet.place.bounding_box.coordinates[0][0][0], "flag": 1 }
    //console.log(esinp)
    
  
  var sqsParams = {
  MessageBody: JSON.stringify(esinp),
  QueueUrl: 'https://sqs.us-east-1.amazonaws.com/423494000181/sss'
};

sqs.sendMessage(sqsParams, function(err, data) {
  if (err) {
    console.log('ERR', err);
  }

  console.log(data);
});

  console.log("gotcha")
}


  }
  });
  
  
  stream.on('error', function(error) {
    console.log(error);
  });
});