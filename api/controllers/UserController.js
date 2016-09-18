/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
// var bcrypt = require('bcrypt');
var crypto = require('crypto');
module.exports = {
	'new' : function(req, res) {
		res.view();
	},

	create: function (req, res, next) {
		// Create a user with the params sent from
		// The sign-up form --> new.ejs
		User.create( req.params.all(), function userCreated (err, user) {
			// If thers's an error
			if (err)
				// console.log(err);
				// req.session.flash = {
				// 	err: err
				// }


				//If error redirect back to sign-up page
				return next(err);
			// After successfully creating the user
			// redirect to the show action
			// res.json(user);
			if (!user) return next('User does not exist');
			//encrypt id to md5
			var verify_token = crypto.createHash('md5').update(user.id).digest("hex");
			User.update({id:user.id},{verify:verify_token}).exec(function afterwards(err, updated){});

			//send url to mail 
			user.url = 'http://localhost:1337/user/active?&code=' + verify_token;
			// user.active = false;
			

			mailService.sendWelcomeMail(user);
			// chuyyen toi trang thong bao active!
			
			res.redirect('/active');

		});
	},

	show: function(req, res, next) {
		User.findOne(req.param('id'), function foundUser(err, user) {
			if (err) 
				return next(err);
			if (!user) 
				return next();
			res.view ({
				user: user
			});
		});	
	},

	index: function(req, res, next) {

		// Get an array of all users in the User collection(e.g. table)
		User.find(function foundUsers(err, users) {
			if (err) 
				return next(err);
			// pass the array down to the /views/user/index.jade page
			res.view({
				users: users
			});
		});
	},

	edit: function(req, res, next) {
		//Find the user from the id passed in via params
		User.findOne(req.param('id'), function foundUser(err, user) {
			if(err)
				return next(err);
			if(!User)
				return next('User doesn\'t exist.');

			res.view({
				user: user
			});
		});
  	},

	update: function(req, res, next) {
		User.update(req.param('id'), req.params.all(), function userUpdated (err) {
			if (err) {
				return res.redirect('/user/edit/' + req.param('id'));
			}

			res.redirect('/user/show/' + req.param('id'));
		});
	},

	active: function(req, res, next) {

		User.findOne({
			verify:req.param('code')
		}).exec(function (err, user) {
			if (err) {
				next(err);
				return;
			}

			User.update({id:user.id}, {
										verify: '',
										active: true
									}).exec(function afterwards(err, updated) {
										if(err) {
											next(err);
											return;
										}
										console.log(updated);
										return res.view('user/login', {
											user: user
										});
									});
		});
	},


	destroy: function(req, res, next) {
		User.findOne(req.param('id'), function foundUser(err, user) {
			if(err)
				return next(err);
			if(!User)
				return next("User doen\,n exist");
			User.destroy (req.param('id'), function userDestroy(err) {
				if(err)
					return next(err);
			});

			res.redirect('/user');
		});
	},

	login: function(req, res) {
		var loginData = req.allParams();

		if (loginData === '') {
				return res.send(404, 'User not found');
		}

		/*
		 * Use sails js Users model
		 */

		User.findOne({
				email: loginData.email,
				password: loginData.password,
				active: true
		}).exec(function(err, data) {
				if (err) return res.send(err, 500);

				if (data) {
						req.session.userSession = data;
						return res.redirect('/user/show/' + data.id);
				} else {
						// req.session.usr = data;
						return res.send(404, 'User not found');
				}
		});
	},


	// login: function(req, res, next) {
	// 	// Check for email and password in params sent via the form, if none
	// 	// redirect the browser back to the sign-in form.
	// 	if (!req.param('email') || !req.param('password')) {
	// 		return next(err);

			

	// 		// Remember that err is the object being passed down (a.k.a. flash.err), whose value is another object with
	// 		// the key of usernamePasswordRequiredError
	// 		// req.session.flash = {
	// 		// 	err: usernamePasswordRequiredError
	// 		// }

	// 		// res.redirect('/session/new');
	// 		// return;
	// 	}

	// 	// Try to find the user by there email address. 
	// 	// findOneByEmail() is a dynamic finder in that it searches the model by a particular attribute.
	// 	// User.findOneByEmail(req.param('email')).done(function(err, user) {
	// 	User.findOne({email:req.param('email')}).exec(function foundUser(err, user) {
	// 		if (err) return next(err);

	// 		// If no user is found...
	// 		if (!user) 
	// 			return next('This account is not exist')

	// 		// Compare password from the form params to the encrypted password of the user found.
	// 		bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid) {
	// 			if (err) return next(err);

	// 			// If the password from the form doesn't match the password from the database...
	// 			if (!valid) return next(err);

	// 			// Log user in
	// 			req.session.authenticated = true;
	// 			req.session.User = user;

				

	// 			//Redirect to their profile page (e.g. /views/user/show.ejs)
	// 			res.redirect('/user/show/' + user.id);
	// 		});
	// 	});
	// }
};

