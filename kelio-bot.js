var events = require('events');
var Nightmare = require('nightmare');       
var nightmare = Nightmare({ show: true });
var gateau = null;

module.exports = function(login, password, kelio_url) {

	console.log('Kelio Bot Start');

	var that = this;
	events.EventEmitter.call(this);
	
	this.login = function(){
		nightmare
			.goto(kelio_url)
			.type('#j_username', login)
			.type('#j_password', password)
			.click('#btnAction')
			.screenshot('screen/loggedIn.png')
			.cookies.get()
			.end()
			.then(function(cookies) {
				console.log(cookies);
				gateau = cookies;
				that.emit('connected');
				done();
			})
			.catch(function(error) {
				console.error(error);
			});
	}
	

	return this;
}

module.exports.prototype.__proto__ = events.EventEmitter.prototype;
