(function(){
	/*
	dadJokeSvc.js
	called from Alexa Skills app alexaDadJoke

	author: bill rowland
	*/

	var CFG = require('./dynamoDBConfig.js');	// initialize the database

	var TABLENAME = 'dadJokes';					// dynamo DB table
	var FILENAME = 'data/dadjokes.json';		// file containing the jokes


	module.exports.test = function(callback){
		setTimeout(callback('bill', 3000));
	};

	module.exports.getRandomDadJoke = function(callback){
		getItemCount(function(jokeIdx){
			getDadJoke(jokeIdx, function(joke){
				callback(joke);
			})
		})
	};

	// determine how many records in the table in order
	// to select a random one
	function getItemCount(callback){
		var params = {
			TableName: TABLENAME,
		};
		// rewrite routine removing describeTable operation so you can remove 
		// AmazonDynamoDBFullAccess policy from user
		// ie this will require a table scan or keep a separate joke counter
		CFG.db.describeTable(params, function(err, data) {
			if (err) callback( { 'error' : err });
			else callback(data.Table.ItemCount);
		});
	};

	// retrieve a dad joke from the db
	// jokeIdx: index of joke to retrieve
	var getDadJoke = function(jokeIdx, callback) {
		callback('dad, call me a taxi.');
	};

	// retrieve a dad joke from the db
	// jokeIdx: index of joke to retrieve
	var getDadJoke = function(jokeIdx, callback) {
		var params = {
			TableName : TABLENAME,
			Key : { idx : jokeIdx }
		};

		CFG.dc.get(params, function(err, data) {
			if (err) callback( { 'error' : err });
			else callback(data.Item.joke);
		});
	};

})();