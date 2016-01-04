var knowBase = angular.module('knowBase',  ['ui.router','ngCookies', 'ngAnimate', 'ngMaterial', 'ngMessages', 'ngImgCrop']);

knowBase.config(function($stateProvider, $urlRouterProvider,$mdThemingProvider) {
    
    $urlRouterProvider.otherwise('/home');
    
    $mdThemingProvider.theme('default')
        .primaryPalette('deep-purple', {
          'default': '700', // primary
          'hue-1': '200', // md-hue-1
          'hue-2': '400', // md-hue-2
          'hue-3': 'A200' // md-hue-3
        }).accentPalette('amber', {
          'default': '700' // use shade 200 for default, and keep all other shades the same
    });

    $mdThemingProvider.theme('grey')
        .primaryPalette('grey',{
          'default': '200', // primary
          'hue-1': '400', // md-hue-1
          'hue-2': '500', // md-hue-2
          'hue-3': 'A200' // md-hue-3
    });



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
            	'toolbar@home' : {
            		controller: 'toolbarController',
            		templateUrl: 'static/partials/toolbar.html'
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
                'toolbar@skills' : {
                    controller: 'toolbarController',
                    templateUrl: 'static/partials/toolbar.html'
                },
                'education@skills':{
                    controller: 'educationController',
                    templateUrl: 'static/partials/education.html'
                },
                'workexperience@skills':{
                    controller: 'workExperienceController',
                    templateUrl: 'static/partials/workexperience.html'
                },
                'project@skills':{
                    controller: 'projectController',
                    templateUrl: 'static/partials/project.html'
                },
                'language@skills':{
                    controller: 'languageController',
                    templateUrl: 'static/partials/language.html'
                },
                'experience@skills':{
                    controller: 'experienceController',
                    templateUrl: 'static/partials/experience.html'
                },
                'skill@skills':{
                    controller: 'skillController',
                    templateUrl: 'static/partials/skill.html'
                },
                'merit@skills':{
                    controller: 'meritController',
                    templateUrl: 'static/partials/merit.html'
                },
                'publication@skills':{
                    controller: 'publicationController',
                    templateUrl: 'static/partials/publication.html'
                }
            },
            access: 'restricted'
        })

        .state('education', {
            url: '/education',
            views: {
                '' : {
                    templateUrl: 'static/partials/education.html',
                    controller: 'educationController'
                },
                'toolbar@education' : {
                    controller: 'toolbarController',
                    templateUrl: 'static/partials/toolbar.html'
                }
            },
            access: 'restricted'
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
            	'toolbar@profile' : {
            		controller: 'toolbarController',
            		templateUrl: 'static/partials/toolbar.html'
            	}
                // ,
                // 'activityfeed@profile' : {
                //     controller: 'activityfeedController',
                //     templateUrl: 'static/partials/activityfeed.html'
                // }

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

