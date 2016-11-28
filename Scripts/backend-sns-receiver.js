var AWS = require('aws-sdk');
var http = require( 'http' );
var deepstreamClient = require( 'deepstream.io-client-js' );
var ds = deepstreamClient( 'localhost:6021' ).login( {}, createHttpServer );
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
         host: 'search-twitterstream-ywbxov7tqypovgqglnjcuer4oq.us-west-2.es.amazonaws.com',
         log: 'trace'
         });
AWS.config.update({
    "SecretAccessKey": "enter your key",
        "SessionToken": "enter session key",
        "Expiration": "2016-11-20T17:10:45Z",
        "AccessKeyId": "enter access key",
         "region": "us-west-2"
});

var sns = new AWS.SNS();

function onAwsResponse( error, data ) {
	console.log( error || data );
}

function subscribeToSnS() {
	var params = {
	  Protocol: 'http', /* required */
	  TopicArn: 'enter topic arn', /* required */
	  Endpoint: 'http://29958347.ngrok.io'
	};
	sns.subscribe(params, onAwsResponse );	
}

function parseJSON( input ) {
	try{
		return JSON.parse( input );
	} catch( e ) {
		return input;
	}
}

function handleIncomingMessage( msgType, msgData ) {
	if( msgType === 'SubscriptionConfirmation') {
		console.log(msgData.token);
		sns.confirmSubscription({
			Token: msgData.Token,
			TopicArn: msgData.TopicArn
		}, onAwsResponse );
	} else if( msgType === 'Notification' ) {
		ds.event.emit( msgData.Subject, parseJSON( msgData.Message ) );
		console.log(parseJSON( msgData.Message ));
		client.index({
  index: 'trends',
  type: 'trends',
  body: parseJSON( msgData.Message )
}, function (error, response) {

});
	} else {
		console.log( 'Unexpected message type ' + msgType );
	}
}

function createHttpServer() {
	var server = new http.Server();

	server.on( 'request', function( request, response ){
		var msgBody = '';

		request.setEncoding( 'utf8' );

		request.on( 'data', function( data ){ 
			msgBody += data;
		});

		request.on( 'end', function(){
			var msgData = parseJSON( msgBody );
			var msgType = request.headers[ 'x-amz-sns-message-type' ];
			handleIncomingMessage( msgType, msgData );
		});

		response.end( 'OK' );
	});

	server.listen( 6001, subscribeToSnS);
}

