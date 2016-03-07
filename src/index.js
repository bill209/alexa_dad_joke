
/**
 * dad joke: this will provide a 'dad' quality joke
 *
 * Dialog model:
 *  User: "Tell me a joke"
 *  Alexa: "What do you call..."
 *  Alexa: "Would you like another joke?"
 *  User: "Yes"
 *  Alexa: "Two men and a parrot..."
 *  ...
 *  User: "No"
 *  Alexa: "OK, but no pain, no gain."
 */

var DJ = require('./dadJokeSvc');
var APP_ID = undefined;//replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

var AlexaSkill = require('./AlexaSkill');
var alexaSkill = function () {
	AlexaSkill.call(this, APP_ID);
};

alexaSkill.prototype = Object.create(AlexaSkill.prototype);
alexaSkill.prototype.constructor = alexaSkill;

alexaSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
	// standard phrasing
	session.attributes.helpText = "Alexa can tell you a dad quality joke, just ask her to tell you a joke.";
	session.attributes.cardTitle = "Dad Joke!";
	session.attributes.repromptText = "Don't be shy, would you like a dad joke?";
	session.attributes.speechText = "Would you like a dad joke?";
	session.attributes.cardOutput = "Would you like a dad joke?";
	session.attributes.noMoreJokesText = "OK, but no pain, no gain.";
	session.attributes.stopText = "Bye bye.";
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
			speech: session.attributes.helpText,
			type: AlexaSkill.speechOutputType.PLAIN_TEXT
		};
		var repromptOutput = {
			speech: session.attributes.repromptText,
			type: AlexaSkill.speechOutputType.PLAIN_TEXT
		};
		response.ask(speechOutput, repromptOutput);
	},
	"AMAZON.NoIntent": function (intent, session, response) {
		response.tell(session.attributes.noMoreJokesText);
	},
	"AMAZON.StopIntent": function (intent, session, response) {
		response.tell(session.attributes.stopText);
	},

	"AMAZON.CancelIntent": function (intent, session, response) {
		response.tell(session.attributes.stopText);
	}
};

// start the dialog upon launch
function startDialog(session, response) {
    var speechOutput = {
        speech: session.attributes.speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    var repromptOutput = {
        speech: session.attributes.repromptText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.askWithCard(speechOutput, repromptOutput, session.attributes.cardTitle, session.attributes.cardOutput);
}

// tell a dad joke
function TellMeADadJoke(session, response) {

	DJ.getRandomDadJoke(function(joke){
		var speechText = "";
		var repromptText = "would you like another?";

		var speechOutput = {
			speech: '<speak>' + joke + '</speak>',
			type: AlexaSkill.speechOutputType.SSML
		};
		var repromptOutput = {
			speech: repromptText,
			type: AlexaSkill.speechOutputType.PLAIN_TEXT
		};
		response.askWithCard(speechOutput, repromptOutput, "Dad Joke", speechText);
	});
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
	// Create an instance of the  alexaSkill.
	var skill = new alexaSkill();
	skill.execute(event, context);
};
