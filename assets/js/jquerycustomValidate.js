$(document).ready(function() {
	//Validate
	$('#form-signin').validate ({
		rules: {
			name: {
				required: true
			},
			job: {
				required: true
			},
			email: {
				required: true,
				email: true
			},
			password: {
				minlength: 6,
				required: true
			},
			confirmation: {
				minlength: 6,
				equalTo: "#password"
			}
		},

		success: function(element) {
			element
			.text('OK').addClass('valid')
		}
	});
});