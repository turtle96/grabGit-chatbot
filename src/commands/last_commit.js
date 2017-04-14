var bot = require('../bot'); 
var moment = require('moment');
var request = require('request');
 
// A case‐insensitive regular expression that matches "/last" 
var commandRegex = /^\/last/i; 
 
bot.onText(commandRegex, function(msg, match) { 
    var replyChatId = msg.chat.id; 
    if (msg.chat.type !== 'private') { 
        // this is a group message, so let's ignore it 
       return;  
    } 
 
    var messageOptions = { parse_mode: 'Markdown' }; 

    console.log(msg.text);

    var parameters = msg.text.split("/last ");
    parameters = parameters[1];

    if (!parameters) {
    	bot.sendMessage(replyChatId, "Please enter owner/repo :D", messageOptions);
    	return;
    }

    console.log(parameters);

    var url = "https://api.github.com/repos/" + parameters + "/commits";

    var reply = "reply";

	var options = {
	  url: url,
	  headers: {
	    'User-Agent': 'request'
	  }
	};

	function callback(error, response, body) {
	  if (!error && response.statusCode == 200) {
	    var result = JSON.parse(body);
	    commit = result[0].commit;

	    var date = moment(commit.committer.date);

	    reply = "Last commit written by " + commit.author.name + " " + date.fromNow()
	    	+ "\nCommit message is:\n" + commit.message;

	    bot.sendMessage(replyChatId, reply, messageOptions);
	  }
	  else {
	  	bot.sendMessage(replyChatId, "Seems like there's an error, please try again.", messageOptions);
	  }
	}

	request(options, callback);
     
});