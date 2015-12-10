var knowBase = angular.module('knowBase',  ['ui.router','ngCookies', 'ngAnimate', 'ngMaterial', 'ngMessages']);

knowBase.config(function($stateProvider, $urlRouterProvider,$mdThemingProvider) {
    
    $urlRouterProvider.otherwise('/home');
    
    $mdThemingProvider.theme('default')
    .primaryPalette('amber', {
      'default': '700', // primary
      'hue-1': '200', // md-hue-1
      'hue-2': '400', // md-hue-2
      'hue-3': 'A200' // md-hue-3
    })


    $stateProvider
        
        // start STATES AND NESTED VIEWS ========================================
        .state('start', {
            url: '/start',
            views: {
            	'' : {
            		templateUrl: 'static/partials/start.html',
            		controller: 'startController'
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
            		controller: 'navController',
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
            		controller: 'navController',
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
            		controller: 'navController',
            		templateUrl: 'static/partials/navbar-home.html'
            	},
        		'info@profile' : {
        			templateUrl: 'static/partials/info.html',
            		controller: 'infoController'
        		},
        		'skills@profile' : {
        			templateUrl: 'static/partials/skills.html',
            		controller: 'skillsController'
        		}

            },
            access: 'restricted'
        })

        
});


knowBase.run(function ($rootScope,$state, $cookies) {
	

	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

		if (toState.access == 'restricted' && !$cookies.get('user')) {

			event.preventDefault();
		  	$state.go('start');
		}
	});

});

