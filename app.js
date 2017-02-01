var config = require('./config.js');
var hangoutsBot = require("./hangouts-bot.js");
var kelioBot = require("./kelio-bot.js");
var EventEmitter = require('events').EventEmitter;

var accounts = config.accounts;
var emitter = new EventEmitter();
//var args = process.argv.slice(2);
var env = process.env;

if (accounts && accounts.kelio && accounts.google) {
    //console.log(accounts);
} else {
    console.warn('provide google / kelio accounts id in arguments or in config file');
    process.exit()
}

var bot = new hangoutsBot(accounts.google.login,accounts.google.password);
var kelio = new kelioBot(accounts.kelio.login,accounts.kelio.password,accounts.kelio.url);

bot.on('online', function() {
    console.log('Yoda online');
    bot.sendMessage(config.to,"Remplir ton Kelio tu dois !");
});

bot.on('message', function(from, message) {
    console.log(from);
    console.log(message);
    kelio.getGateau();
});

kelio.on('connected', () => {
    console.log('Kelio connected');
});

kelio.login();