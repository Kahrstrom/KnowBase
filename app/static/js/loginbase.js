var knowbase = {
	vm : {},
	init: function(){
		// loader.loadView('login', $("#content"));
		vm = new viewModel();

		ko.applyBindings(vm);
	}

	
};


var viewModel = function(){
	var self = this;
	self.test = ko.observable('dsfsdfsd');
	self.firstName = ko.observable('');
	self.lastName = ko.observable('');
	self.email = ko.observable('');
	self.validateEmail = ko.computed(function(){
		var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    	return re.test(self.email());
	});
	self.password = ko.observable('');
	self.passwordConfirm = ko.observable('');

	self.validatePassword = ko.computed(function(){
		return self.password() == self.passwordConfirm();
	});
	self.signupError = ko.observable(false);
	self.loginError = ko.observable(false);
	

	self.signup = function(){
		if(self.validatePassword()){
			self.signupError(false);
	 		$.ajax(
	 		{
				type: "POST",
				url: "/signup",
				data : 
				{ 	'firstname': self.firstName(), 
					'lastname': self.lastName(),
					'email' : self.email(),
					'password' : self.password() 
				},
				success: function(results) {
					self.signupError(false);
					location.href = '/login';
				},
				error: function(error) {
					self.signupError(true);
				}
	    	});
	 	}
	 	else{
	 		self.signupError(true);
	 	}
	}


	self.login = function(){
		self.loginError(false);
		$.ajax(
		{
			type: "POST",
			url: "/login",
			data:
			{
				'email' : self.email(),
				'password' : self.password()
			},
			success: function(results){
				console.log(results)
				self.loginError(false);
				location.href = '/';
			},
			error: function(error){
				console.log(error);
				self.loginError(true);
			}
		});
	}

	self.title = ko.observable("KnowBase");
}

$(function(){
	$(document).ready(function(){
		knowbase.init();
	});
});