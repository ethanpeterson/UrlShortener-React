var users = require('../../app/controllers/users.server.controller'),
	passport = require('passport');

module.exports = function(app) {
	app.route('/signup')
		.get(users.renderSignup)
		.post(users.signup);

	app.route('/signin')
		.get(users.renderSignin)
		.post(passport.authenticate('local', {
			failureRedirect: '/signin',
			failureFlash: true
		}), function(req, res) {
			var redirectUrl = req.session.returnTo || '/';
			delete req.session.returnTo;
			return res.redirect(redirectUrl);
		});

	app.get('/signout', users.signout);
};
