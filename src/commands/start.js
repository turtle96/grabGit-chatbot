var bot = require('../bot'); 
 
// A case‐insensitive regular expression that matches "/hello" 
var commandRegex = /^\/start$/i; 
 
bot.onText(commandRegex, function(msg, match) { 
    var replyChatId = msg.chat.id; 
    if (msg.chat.type !== 'private') { 
        // this is a group message, so let's ignore it 
       return;  
    } 
 
    var messageOptions = { parse_mode: 'Markdown' }; 
    var message = formatMessage()
    bot.sendMessage(replyChatId, 
                   message, 
                   messageOptions); 
});

function formatMessage() {
	var msg = "Hello there! Thanks for trying out our bot!\n" +
		"Here are some commands to try out\n\n"

	var top3 = "/top3 repoOwner repoName - " +
		"returns the top 3 contributors of a Repo"
	var top = "/toprecent repoOwner repoName - " +
		"returns the top contributor of a Repo in the last week"
	var last = "/last repoOwner repoName - " +
		"returns information about the latest commit"

	return msg + top3 + "\n" + top + "\n" + last
}