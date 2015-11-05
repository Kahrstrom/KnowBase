var knowBase = angular.module('knowBase',  ['ui.router','ngCookies']);

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
            	'top@start' : {
            		controller: 'topbarController',
            		templateUrl: 'static/partials/topbar.html'
            	},
            	'nav@start' : {
            		controller: 'navController',
            		templateUrl: 'static/partials/navbar-home.html'
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
            	'top@home' : {
            		controller: 'topbarController',
            		templateUrl: 'static/partials/topbar.html'
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
        		},
        		'top@login' : {
            		controller: 'topbarController',
            		templateUrl: 'static/partials/topbar.html'
            	},
            	'nav@login' : {
            		controller: 'navController',
            		templateUrl: 'static/partials/navbar-home.html'
            	},
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
        		'top@signup' : {
            		controller: 'topbarController',
            		templateUrl: 'static/partials/topbar.html'
            	},
            	'nav@signup' : {
            		controller: 'navController',
            		templateUrl: 'static/partials/navbar-home.html'
            	},
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
        		'top@skills' : {
            		controller: 'topbarController',
            		templateUrl: 'static/partials/topbar.html'
            	},
            	'nav@skills' : {
            		controller: 'navController',
            		templateUrl: 'static/partials/navbar-home.html'
            	},
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
        		'top@profile' : {
            		controller: 'topbarController',
            		templateUrl: 'static/partials/topbar.html'
            	},
            	'nav@profile' : {
            		controller: 'navController',
            		templateUrl: 'static/partials/navbar-home.html'
            	},
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

