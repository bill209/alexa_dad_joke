
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

// library of bad jokes
var dad_jokes = [
	"this is joke one",
	"joke number two",
	"three jokes!"
]

var APP_ID = undefined;//replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

// The AlexaSkill prototype and helper functions
var AlexaSkill = require('./AlexaSkill');

// setup patternSkill
var patternSkill = function () {
	AlexaSkill.call(this, APP_ID);
};

patternSkill.prototype = Object.create(AlexaSkill.prototype);
patternSkill.prototype.constructor = patternSkill;

patternSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
	// standard phrasing
	session.attributes.helpText = "Alexa can tell you a dad quality joke, just ask her to tell you a joke.";
	session.attributes.cardTitle = "Dad Joke!";
	session.attributes.repromptText = "Don't be shy, would you like a dad joke?";
	session.attributes.speechText = "Would you like a dad joke?";
	session.attributes.cardOutput = "Would you like a dad joke?";
	session.attributes.stopText = "OK, but no pain, no gain.";
};

// default intent
patternSkill.prototype.eventHandlers.onLaunch = function (session, response) {
	startDialog(response);
};

// intent handlers
patternSkill.prototype.intentHandlers = {
    "TellMeAJoke": function (intent, session, response) {
		TellMeAJoke(session, response);
	},
	"TellMeAnotherJoke": function (intent, session, response) {
		TellMeAJoke(session, response);
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
function TellMeAJoke(session, response) {
	// pull a random joke from the dad_jokes array
	joke = dad_jokes[Math.floor(Math.random()*dad_jokes.length)];

	speechText ='<speak>' + joke + '<break time="3s"/> Would you like another?</speak>';

	var speechOutput = {
		speech: speechText,
		type: AlexaSkill.speechOutputType.SSML
	};
    var repromptOutput = {
        speech: session.attributes.repromptText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.askWithCard(speechOutput, repromptOutput, session.attributes.cardTitle, session.attributes.cardOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
	// Create an instance of the  patternSkill.
	var skill = new patternSkill();
	skill.execute(event, context);
};
