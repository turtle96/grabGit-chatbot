var bot = require('../bot'); 
var moment = require('moment');
var request = require('request');
 
// A case‐insensitive regular expression that matches "/last" 
var commandRegex = /^\/last\s+(.+)\s+(.+)/i;
 
bot.onText(commandRegex, function(msg, match) { 
	var repoOwner = match[1];
  	var repoName = match[2];

    var replyChatId = msg.chat.id; 
    if (msg.chat.type !== 'private') { 
        // this is a group message, so let's ignore it 
       return;  
    } 
 
    var messageOptions = { parse_mode: 'Markdown' }; 

    var url = "https://api.github.com/repos/"+repoOwner+"/"+repoName+"/commits";

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

	    reply = "Last commit written by:\n*" + commit.author.name + "* _" + date.fromNow()
	    	+ "_\nCommit message is:\n" + commit.message;

	    bot.sendMessage(replyChatId, reply, messageOptions);
	  }
	  else {
	      bot.sendMessage(replyChatId,
                  "Oops..It seems like you have typed the wrong repo name or owner.\n" +
                  "It could also be that we have have reached maximum github API calls for the day.\n" +
                  "Thanks for using our bot!",
                  messageOptions);
	  }
	}

	request(options, callback);
     
});