var events = require('events');
var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true });
var gateau = null;

module.exports = function(login, password, kelio_url) {

	console.log('Kelio Bot Start');

	var that = this;
	events.EventEmitter.call(this);

	this.kelio = function(){
		return Nightmare({ show: false })
		.goto(kelio_url)
		.screenshot('screen/1_logginPage.png')
		.type('#j_username', login)
		.type('#j_password', password)
		.click('#btnAction')
		.wait(1000);
	}

	this.login = function(){
		this.kelio()
			.screenshot('screen/2_after_loggedIn.png')
			.cookies.get()
			.end()
			.then(function(cookies) {
				gateau = cookies;
				that.emit('connected');
			})
			.catch(function(error) {
				console.error(error);
			});
	}

	this.getGateau = function(){
		return gateau;
	}


	this.getClients = function(){

		this.kelio()
			.wait(2000)
			.screenshot('screen/3_afterCookiesSet.png')
			.evaluate(() => {
				var clients = [];
				[...document.querySelectorAll('#b2')].map(client => {
					clients.push(client.innerText.replace("&nbsp", ""));
				});
				return clients;
			})
			.end()
			.then(function(clients) {
				console.log("clients");
				console.log(clients);
				that.emit('clients',clients);
			});
	}

	this.setClientValue = function(client){

		this.kelio()
			.wait(2000)
			.evaluate(() => {
				return
			})
			.end()
			.then(function(clients) {
				that.emit('clientSet',client);
			});
	}

	return this;
}

module.exports.prototype.__proto__ = events.EventEmitter.prototype;
