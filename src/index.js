
/**
	dad joke: this will provide a 'dad' quality joke
	see dialogModel.txt for the Alexa/User dialog options

	author: bill rowland
 */

var DJ = require('./dadJokeSvc');
var APP_ID = "amzn1.echo-sdk-ams.app.bd19edaf-2dc8-42a4-8764-e81ae8d998b4";

var AlexaSkill = require('./AlexaSkill');
var alexaSkill = function () {
	AlexaSkill.call(this, APP_ID);
};
console.log('*****session****',session.application.applicationId);

// if (event.session.application.id !== APP_ID) {
// 	context.fail("Invalid Application ID");
// }

alexaSkill.prototype = Object.create(AlexaSkill.prototype);
alexaSkill.prototype.constructor = alexaSkill;

alexaSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
	// standard phrasing
	session.attributes.speech = {};
	session.attributes.speech.launch = "Hi, dad can tell you a joke, would you like a joke?";
	session.attributes.speech.reprompt = "I am sorry but I did not catch that. Would you like a joke?";
	session.attributes.speech.help= "Would you like a dad quality joke? Just ask for a joke.";
	session.attributes.repromptAnother = "Don't be shy, would you like another dad joke?";
//	session.attributes.card.title = "Dad Joke!";
	session.attributes.speech.noMoreJokes = "OK, but no pain, no gain.";
	session.attributes.speech.stop = "Bye bye.";
};

// default intent
alexaSkill.prototype.eventHandlers.onLaunch = function (session, response) {
	startDialog(response);
};

// intent handlers
alexaSkill.prototype.intentHandlers = {
	"TellMeADadJoke": function (intent, session, response) {
		TellMeADadJoke(session, response);
	},
	"AMAZON.YesIntent": function (intent, session, response) {
		TellMeADadJoke(session, response);
	},
	"AMAZON.HelpIntent": function (intent, session, response) {
		var speechOutput = {
			speech: session.attributes.speech.help,
			type: AlexaSkill.speechOutputType.PLAIN_TEXT
		};
		var repromptOutput = {
			speech: session.attributes.speech.reprompt,
			type: AlexaSkill.speechOutputType.PLAIN_TEXT
		};
		response.ask(speechOutput, repromptOutput);
	},
	"AMAZON.NoIntent": function (intent, session, response) {
		response.tell(session.attributes.speech.noMoreJokes);
	},
	"AMAZON.StopIntent": function (intent, session, response) {
		response.tell(session.attributes.speech.stop);
	},
	"AMAZON.CancelIntent": function (intent, session, response) {
		response.tell(session.attributes.speech.stop);
	}
};

// start the dialog upon launch
function startDialog(session, response) {
	var speechOutput = {
		speech: session.attributes.speech.launch,
		type: AlexaSkill.speechOutputType.PLAIN_TEXT
	};
	var repromptOutput = {
		speech: session.attributes.speech.reprompt,
		type: AlexaSkill.speechOutputType.PLAIN_TEXT
	};
	response.ask(speechOutput, repromptOutput);
}

// tell a dad joke
function TellMeADadJoke(session, response) {

	DJ.getRandomDadJoke(function(joke){
		var cardText = joke.replace(/ <.*?>/, ""); 	// remove any SSML code

		var speechOutput = {
			speech: '<speak>' + joke + '</speak>',
			type: AlexaSkill.speechOutputType.SSML
		};
		var repromptOutput = {
			speech: session.attributes.repromptAnother,
			type: AlexaSkill.speechOutputType.PLAIN_TEXT
		};
		response.askWithCard(speechOutput, repromptOutput, "Dad Joke", cardText);
	});
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
	// Create an instance of the  alexaSkill.
	var skill = new alexaSkill();
	skill.execute(event, context);
};
