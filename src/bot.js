var TelegramBot = require('node-telegram-bot-api'); 
var token = process.env.TELEGRAM_TOKEN || ''; 
 
var options = { 
    polling: { 
        interval: 5000, 
        params: 20 
    } 
}; 
 
module.exports = new TelegramBot(token, options);
