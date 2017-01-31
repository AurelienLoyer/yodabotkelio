var events = require('events');
var phantom = require('phantom');

module.exports = function(login, password, kelio_url) {
	events.EventEmitter.call(this);
	var that = this;

	phantom.create({parameters: {'cookies-file': 'cookies.txt', 'web-security': false}}, function(ph) {
		ph.createPage(function (page) {
		ph.createPage(function (news) {
			initPages(page, news);
		});
		});
	});

	var initPages = function(page, news) {
		page.set('onResourceReceived', function(resource) {
		
		});

		if (url == kelio_url + '/open/login') {
          console.log('login promt');
          page.render('page_login.png');
          page.evaluate(function(args) {
            $('#j_username').val(args.login);
            $('#j_password').val(args.password);
            $('#btnAction').click();
          }, function(err, title) {console.error(err);}, {
            login: login,
            password: password
          });
        } else {
          console.log('we are logged in already');
          //initHeroBot(account);
        }
	}
	


	return this;
}

module.exports.prototype.__proto__ = events.EventEmitter.prototype;