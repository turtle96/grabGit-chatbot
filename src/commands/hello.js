var bot = require('../bot'); 
 
// A case‐insensitive regular expression that matches "/hello" 
var commandRegex = /^\/hello$/i; 
 
bot.onText(commandRegex, function(msg, match) { 
    var replyChatId = msg.chat.id; 
    if (msg.chat.type !== 'private') { 
        // this is a group message, so let's ignore it 
       return;  
    } 
 
    var messageOptions = { parse_mode: 'Markdown' }; 
    bot.sendMessage(replyChatId, 
                   "Hello chickens", 
                   messageOptions); 
});