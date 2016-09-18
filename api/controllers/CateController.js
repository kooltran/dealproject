/**
 * CateController
 *
 * @description :: Server-side logic for managing cates
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function (req, res, next) {
		// Create a user with the params sent from
		// The sign-up form --> new.ejs
		Cate.create( req.params.all(), function cateCreated (err, cates) {
			// If thers's an error
			if (err) return next(err);

			res.redirect('/cate/index');

		});
	},

	index: function(req, res, next) {

		// Get an array of all cates in the Cate collection(e.g. table)
		Cate.find(function foundCates(err, cates) {
			if (err) 
				return next(err);
			// pass the array down to the /views/cate/index.jade page
			res.view({
				cates: cates
			});
		});
	},
	
};

