var bot = require('../bot');
// need to edit the command and make it accept a parameter
var commandRegex = /^\/top3\s+(.+)\s+(.+)/i;

var url;

bot.onText(commandRegex, function(msg, match) {
  var repoOwner = match[1];
  var repoName = match[2];

  url = "https://api.github.com/repos/"+repoOwner+"/"+repoName+"/stats/contributors";

  var replyChatId = msg.chat.id;
  if (msg.chat.type !== 'private') {
    // this is a group message, so let's ignore it
    return;
  }
  var messageOptions = { parse_mode: 'Markdown' };
  var output = getAnswer(replyChatId, messageOptions);
  bot.sendMessage(replyChatId,
                  output,
                  messageOptions);
});

function getAnswer(replyChatId, messageOptions) {

  var request = require('request');

  var options = {
    url: url,
    json: true,
    headers: {
      'User-Agent': 'request'
    }
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = body;
      data.sort(sortDes());
      var index = 1;
      var output = "Top 3 Contributors:";
      for (var i in data) {
        output += "\n" + index + ". " + data[i]['author']['login'];
        index++;
        if (i == 2) {
          break;
        }
      }
      bot.sendMessage(replyChatId,
                  output,
                  messageOptions);
    } else {
      bot.sendMessage(replyChatId,
                  "Oops..It seems like you have type the wrong repo name or owner.\n" +
                  "It could also be that we have have reached maximum github API calls for the day.\n" +
                  "Thanks for using our bot!",
                  messageOptions);
    }
  });
  
  return "Processing...";

}

function sortDes() {
  return function(a,b){
      if( a["total"] > b["total"]){
          return -1;
      }else if( a["total"] < b["total"] ){
          return 1;
      }
      return 0;
   }
}