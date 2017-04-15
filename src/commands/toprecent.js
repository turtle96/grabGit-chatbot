var bot = require('../bot');
var moment = require('moment');

var now = moment();
var sevenDaysAgo = now.subtract(7, 'days');

// need to edit the command and make it accept a parameter
var commandRegex = /^\/toprecent\s+(.+)\s+(.+)/i;

bot.onText(commandRegex, function(msg, match) {
  var repoOwner = match[1];
  var repoName = match[2];

  url = "https://api.github.com/repos/"+repoOwner+"/"+repoName+"/commits?since="+sevenDaysAgo.toISOString()+"?until="+now.toISOString();  

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

  request(options, function (err, res, bod) {
    if (!err && res.statusCode == 200) {
      var data = bod;

      var result = countCommitByAuthor(data);

      result = assocArrToNumericArr(result);

      result.sort(sortByDescCommitCount);

      formattedResult = formatResult(result);

      bot.sendMessage(replyChatId,
                  formattedResult,
                  messageOptions);
    } else {
      bot.sendMessage(replyChatId,
                  "Oops..It seems like you have typed the wrong repo name or owner.\n" +
                  "It could also be that we have have reached maximum github API calls for the day.\n" +
                  "Thanks for using our bot!",
                  messageOptions);
    }
  });
  
  return "Processing...";

}

function sortByDescCommitCount(author1, author2){
  return author2.commit_count - author1.commit_count;
}

/* Give each unique author a bucket, count number of commits submitted. */
function countCommitByAuthor(data){
  return data.reduce(function(prev, curr){
      var author = curr['commit']['author']['name'];

      if(author in prev){
        prev[author]['commit_count'] +=1;
      }else{
        prev[author] = {
            'name': author,
            'commit_count': 1
        };
      }

      return prev;
  }, []);
}

/* Unitility function. Transform associative array to numeric array. */
function assocArrToNumericArr(countCommitByAuthor){
  var result = [];
  for(var key in countCommitByAuthor){
    result.push(countCommitByAuthor[key]);
  }

  return result;
}

/* Format result to output to client*/
function formatResult(result){
  return result.reduce(function(prev, curr){
      prev += "*"+curr.name +"* has *" + curr.commit_count + "* commit(s)!\n";

      return prev;
  }, "");
}