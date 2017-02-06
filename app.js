var config = require('./config.js');
var hangoutsBot = require("./hangouts-bot.js");
var kelioBot = require("./kelio-bot.js");
var EventEmitter = require('events').EventEmitter;

var accounts = config.accounts;
var emitter = new EventEmitter();
//var args = process.argv.slice(2);
var env = process.env;
var clients_list = [];
var value_2_set = null;
var value_total = 0;

if (accounts && accounts.kelio && accounts.google) {
    //console.log(accounts);
} else {
    console.warn('provide google / kelio accounts id in arguments or in config file');
    process.exit();
}

if(config.workdays.indexOf(new Date().getDay() - 1) == -1){
  console.log("Je ne travails pas aujourd'hui !");
  process.exit();
}

var bot = new hangoutsBot(accounts.google.login,accounts.google.password);
var kelio = new kelioBot(accounts.kelio.login,accounts.kelio.password,accounts.kelio.url);

bot.on('online', function() {
    console.log('Yoda online');
    bot.sendMessage(config.to,"Inspecter ton Kelio je vais.");
    kelio.login();
});

bot.on('message', function(from, message) {
    console.log(from);
    console.log(message);
    if(value_2_set){
      var prc = parseInt(message);
      console.log(prc);
      if(prc && prc <= 100 && prc >= 1 && value_total+prc <= 100){
        value_2_set.value = prc;
        value_total += prc;
        console.log(value_total);
        kelio.setClientValue(value_2_set);
        bot.sendMessage(config.to,"Renseigner "+prc+"% pour '"+clients_list[value_2_set.client_id]+"' je vais.");
      }else{
        bot.sendMessage(config.to,"Me berner tu essaies ?");
        bot.sendMessage(config.to,"Le pourcentage pour '"+clients_list[value_2_set.client_id]+"' me dire tu dois.");
      }
    }else{
        switch_message(message);
    }
});

kelio.on('clients', (clients) => {
    clients_list = clients;
    bot.sendMessage(config.to,"Ta liste de client j'ai trouvé !");
    list_clients();
})

kelio.on('clientSet', (client) => {
  bot.sendMessage(config.to,"Pourcentage pour '"+clients_list[client.client_id]+"' mis à jour !");
  if(value_total == 100){
    finish();
  }else{
    bot.sendMessage(config.to,"Cela ne fait pas 100%.");
    value_2_set = null;
    list_clients();
  }
});

kelio.on('connected', (addition) => {
    console.log('Yoda connected to Kelio');
    console.log(addition);
    bot.sendMessage(config.to,'Connecter je me suis !');
    if(addition < 100)
      kelio.getClients();
    else
      finish();
});

function finish(){
  bot.sendMessage(config.to,"Cela fait 100% !");
  bot.sendMessage(config.to,"Que la force soit avec toi !");
  setTimeout(() => {
    process.exit();
  }, 3000)

}

function list_clients(){
  var message_clients = "";
  for (var i = 0; i < clients_list.length; i++) {
    message_clients += "- ("+i+")"+clients_list[i]+"\r\n";
  }
  bot.sendMessage(config.to,message_clients);
  if(value_total > 0)
    bot.sendMessage(config.to,"Ton autre client de la journée choisir tu dois.");
  else
    bot.sendMessage(config.to,"Ton client de la journée choisir tu dois.");
}

function switch_message(message){
  switch (message) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
          value_2_set = {};
          value_2_set["client_id"] = message;
          value_2_set["value"] = null;
          bot.sendMessage(config.to,"Le pourcentage pour '"+clients_list[value_2_set.client_id]+"' me dire tu dois.");
          break;
      case 'gateau':
          bot.sendMessage(config.to,"Du gateau tu veux ?");
          console.log(kelio.getGateau());
          break;

      case 'clients':
          bot.sendMessage(config.to,"Choisir ton client du dois !");
          break;

      default:
          break;
  }
}
