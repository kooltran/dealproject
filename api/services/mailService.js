module.exports.sendWelcomeMail = function(obj) {
	sails.hooks.email.send("welcomEmail", 
	{
		Name: obj.name,
		Url: obj.url
	},
	{
		to: obj.email,
		subject: "Welcome email"
	},

	function(err) {console.log(err || "Mail Sent!");}
	)
}