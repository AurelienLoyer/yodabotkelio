var events = require('events');
var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true });
var gateau = null;

module.exports = function(login, password, kelio_url) {

	console.log('Kelio Bot Start');

	var that = this;
	var dates;
	events.EventEmitter.call(this);

	this.kelio = function(){
		return Nightmare({ show: true })
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
				var result = {};
				[...document.querySelectorAll('#b2')].map(client => {
					clients.push(client.innerText.replace("&nbsp", ""));
				});
				result['clients'] = clients;
				result['dates'] = DATES;
				return result;
			})
			.end()
			.then((result) => {
				dates = result.dates;
				that.emit('clients',result.clients);
			});
	}

	this.setClientValue = function(client){

		var validation = ".tdAction a[href='javascript:fcValiderSaisieActivite()']";
		var day_index = new Date().getDay() - 1;
		var date_id = dates[day_index][parseInt(client.client_id) + 1];
		console.log("set client value");
		console.log(dates);
		console.log(day_index);
		console.log(parseInt(client.client_id) + 1);
		console.log(date_id);

		this.kelio()
			.wait(2000)
			.type(date_id, client.value)
			.wait(2000)
			.click(validation)
			.wait(2000)
			.end()
			.then(function(clients) {
				that.emit('clientSet',client);
			});


	}

	return this;
}

module.exports.prototype.__proto__ = events.EventEmitter.prototype;
