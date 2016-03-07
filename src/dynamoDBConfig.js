//	var KEY = require('./keys');
var KEY = require('./keys.js');	// initialize the database
var AWS = require('aws-sdk');
var dynDBConfig = {
	"accessKeyId": KEY.accessKeyId,
	"secretAccessKey": KEY.secretAccessKey,
	"region": "us-east-1",
	"endpoint": new AWS.Endpoint("dynamodb.us-east-1.amazonaws.com")
};

AWS.config.update(dynDBConfig);

exports.db = new AWS.DynamoDB();
exports.dc = new AWS.DynamoDB.DocumentClient();
