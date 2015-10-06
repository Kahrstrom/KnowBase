var knowBase = angular.module('knowBase',  ['ui.router']);

knowBase.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
        
        // start STATES AND NESTED VIEWS ========================================
        .state('start', {
            url: '/start',
            views: {
            	'' : {
            		templateUrl: 'static/partials/start.html',
            		controller: 'startController'
            	},
            	'nav@start' : {
            		templateUrl: 'static/partials/navbar-start.html'
            	},
            	'news@start' : {
            		templateUrl: 'static/partials/news.html',
            		controller: 'newsController'
            	},
            	'about@start' : {
            		templateUrl: 'static/partials/about.html',
            		controller: 'aboutController'
            	},
            	'contact@start' : {
            		templateUrl: 'static/partials/contact.html',
            		controller: 'contactController'
            	}
        	},
        	access: 'open'
        })

		.state('home', {
            url: '/home',
            views: {
            	'' : {
            		templateUrl: 'static/partials/home.html',
            		controller: 'homeController'
            	},
            	'nav@home' : {
            		templateUrl: 'static/partials/navbar-home.html'
            	},
            	'news@home' : {
            		templateUrl: 'static/partials/news.html',
            		controller: 'newsController'
            	},
            	'about@home' : {
            		templateUrl: 'static/partials/about.html',
            		controller: 'aboutController'
            	},
            	'contact@home' : {
            		templateUrl: 'static/partials/contact.html',
            		controller: 'contactController'
            	}
        	},
        	access : 'restricted'
        })

        .state('login', {
            url: '/login',
            views: {
        		'' : {
        			templateUrl: 'static/partials/login.html',
            		controller: 'loginController'
        		},
        		'nav@login' : {
        			templateUrl: 'static/partials/navbar-start.html'
        		}
            },
            access: 'open'
            
        })

        .state('signup', {
            url: '/signup',
            views: {
        		'' : {
        			templateUrl: 'static/partials/signup.html',
            		controller: 'signupController'
        		},
        		'nav@signup' : {
        			templateUrl: 'static/partials/navbar-start.html'
        		}
            },
            access: 'open'
        })

        .state('skills', {
            url: '/skills',
            views: {
        		'' : {
        			templateUrl: 'static/partials/skills.html',
            		controller: 'skillsController'
        		},
        		'nav@skills' : {
        			templateUrl: 'static/partials/navbar-home.html'
        		}
            },
            access: 'open'
        })

        .state('logout', {
            url: '/logout',
            controller: 'logoutController',
            access: 'open'
        })

        .state('profile',{
        	url: '/profile',
        	views: {
        		'' : {
        			templateUrl: 'static/partials/profile.html',
            		controller: 'profileController'
        		},
        		'nav@profile' : {
        			templateUrl: 'static/partials/navbar-home.html'
        		}
            },
            access: 'restricted'
        })

        
});


knowBase.run(function ($rootScope,$state, AuthService) {

	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

		if (toState.access == 'restricted' && AuthService.isLoggedIn() === false) {
			// event.preventDefault();
		  	// $state.go('start');
		}
	});
});

