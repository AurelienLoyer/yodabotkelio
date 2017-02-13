var events = require('events');
var Nightmare = require('nightmare');
var nightmare = Nightmare();
var gateau = null;
var addition = 0;

module.exports = function(login, password, kelio_url) {

	console.log('Kelio Bot Start');

	var that = this;
	var dates;
	events.EventEmitter.call(this);

	this.kelio = function(){
		return Nightmare({ show: false })
		.goto(kelio_url)
		//.screenshot('screen/1_logginPage.png')
		.type('#j_username', login)
		.type('#j_password', password)
		.click('#btnAction')
		.wait(1000);
	}

	this.login = function(){
		this.kelio()
			//.screenshot('screen/2_after_loggedIn.png')
			.end()
			.evaluate((today) => {
				return document.getElementById("addition_"+today).innerText.replace('%','')
			},that.getCurrentDate())
			.then(function(add) {
				//addition_20170206
				addition = parseInt(add);
				that.emit('connected',addition);
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
			//.screenshot('screen/3_afterCookiesSet.png')
			.evaluate(() => {
				var clients = [];
				var result = {};
				[...document.querySelectorAll('#b2')].map(client => {
					clients.push(client.parentElement.innerText.replace("&nbsp", ""));
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
		date_id = "input[name='"+date_id+"']";

		this.kelio()
			.wait(2000)
			.type(date_id, client.value)
			.click(validation)
			.wait(2000)
			.end()
			.then(function(clients) {
				that.emit('clientSet',client);
			});

	}

	this.getCurrentDate = function(){
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!

		var yyyy = today.getFullYear();
		if(dd<10){
		    dd='0'+dd;
		}
		if(mm<10){
		    mm='0'+mm;
		}
		return yyyy+mm+dd;
	}

	return this;
}

module.exports.prototype.__proto__ = events.EventEmitter.prototype;
