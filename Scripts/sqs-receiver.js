var AWS = require('aws-sdk');
var TwitterPackage = require('twitter');
var AlchemyLanguageV1 = require('watson-developer-cloud/alchemy-language/v1');

var alchemy_language = new AlchemyLanguageV1({
  api_key: ''
});
var sns = new AWS.SNS();




AWS.config.update({accessKeyId: '', secretAccessKey: '', "region": "us-west-2"});
var Consumer = require('sqs-consumer');

var app = Consumer.create({
  queueUrl: 'enter sqs queue url',
  region: 'eu-west-1',
  batchSize: 1,
  handleMessage: function (message, done) {

    var msgBody = JSON.parse(message.Body);

    console.log(msgBody.text);

    var params = {
  text: msgBody.text
};
alchemy_language.sentiment(params, function (err, response) {
  if (err)
    console.log('error:', err);
  else
  	var a = JSON.stringify(response.docSentiment.type, null, 2);

    console.log(a);
    var b = { "username":msgBody.username, "text":msgBody.text,"latitude":msgBody.latitude,"longitude":msgBody.longitude, "sentiment": a, "flag": 1}
    console.log(b)
    var sns = new AWS.SNS();
    var params1 = {
  Message: JSON.stringify(b), /* required */
  Subject: 'STRING_VAL',
  TopicArn: ''
};
sns.publish(params1, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
    console.log('----------------------------------------------------------');
});
    return done();

  }
});

app.on('error', function (err) {
  console.log(err);
});

app.start();