var knowBase = angular.module('knowBase',  ['ui.router','ngCookies', 'ngAnimate', 'ngMaterial', 'ngMessages', 'ngImgCrop', 'am.date-picker']);

knowBase.config(function($stateProvider, $urlRouterProvider,$mdThemingProvider, amDatePickerConfigProvider) {
    var self = this;
    var $cookies;
    angular.injector(['ngCookies']).invoke(['$cookies', function(_$cookies_) {
        $cookies = _$cookies_;
    }]);

    

    $urlRouterProvider.otherwise('/home');
    $mdThemingProvider.theme('default')
        .primaryPalette('deep-purple', {
          'default': '700', // primary
          'hue-1': '200', // md-hue-1
          'hue-2': '600', // md-hue-2
          'hue-3': 'A200' // md-hue-3
        }).accentPalette('amber', {
          'default': '700' // use shade 200 for default, and keep all other shades the same
    });
   

    $mdThemingProvider.theme('grey')
        .primaryPalette('grey',{
          'default': '50', // primary
          'hue-1': '400', // md-hue-1
          'hue-2': '500', // md-hue-2
          'hue-3': 'A200' // md-hue-3

    });




    self.locale = $cookies.get('locale');
    self.locale = self.locale ? JSON.parse(self.locale).value : 'en';
    

    
    console.log(self.locale)

    amDatePickerConfigProvider.setOptions({
        popupDateFormat: 'LL',
        locale: self.locale ? self.locale : 'en',
        calendarIcon: '/static/resources/icons/ic_today_24px.svg',
        clearIcon: '/static/resources/icons/ic_close_24px.svg',
        nextIcon: '/static/resources/icons/ic_chevron_right_18px.svg',
        prevIcon: '/static/resources/icons/ic_chevron_left_18px.svg'
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
                'dashboard@home' : {
                    templateUrl: 'static/partials/dashboard.html',
                    controller: 'dashboardController'
                },
                'details@home' : {
                    templateUrl: 'static/partials/details.html',
                    controller: 'detailsController'
                },
                
            	'toolbar@home' : {
            		controller: 'toolbarController',
            		templateUrl: 'static/partials/toolbar.html'
            	}
        	},
        	access : 'restricted'
        })

        .state('search', {
            url: '/search',
            views: {
                '' : {
                    templateUrl: 'static/partials/search.html',
                    controller: 'searchController'
                },
                'details@search' : {
                    templateUrl: 'static/partials/details.html',
                    controller: 'detailsController'
                },
                'resourcerequests@search' : {
                    templateUrl: 'static/partials/resourcerequest.list.html',
                    controller: 'resourceRequestController'
                },
                'competenceprofile@search' : {
                    templateUrl: 'static/partials/competenceprofile.view.html',
                    controller: 'detailsController'
                },
                'viewEducation@search' : {
                    controller: 'educationFormController',
                    templateUrl: 'static/partials/education.view.html'
                }
                ,
                'viewWorkExperience@search' : {
                    controller: 'workExperienceFormController',
                    templateUrl: 'static/partials/workexperience.view.html'
                }
                ,
                'viewExperience@search' : {
                    controller: 'experienceFormController',
                    templateUrl: 'static/partials/experience.view.html'
                },
                'viewMerit@search' : {
                    controller: 'meritFormController',
                    templateUrl: 'static/partials/merit.view.html'
                },
                'viewSkill@search' : {
                    controller: 'skillFormController',
                    templateUrl: 'static/partials/skill.view.html'
                },
                'viewLanguage@search' : {
                    controller: 'languageFormController',
                    templateUrl: 'static/partials/language.view.html'
                },
                'viewPublication@search' : {
                    controller: 'publicationFormController',
                    templateUrl: 'static/partials/publication.view.html'
                },
                'viewProject@search' : {
                    controller: 'projectFormController',
                    templateUrl: 'static/partials/project.view.html'
                },
              
                'competences@search' : {
                    templateUrl: 'static/partials/search.competences.html'
                },
                'profiles@search' : {
                    templateUrl: 'static/partials/search.profiles.html'
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

        .state('resourcerequest', {
            url: '/resourcerequest',
            views: {
                '' : {
                    templateUrl: 'static/partials/resourcerequest.html',
                    controller: 'resourceRequestController'
                },
                'toolbar@resourcerequest' : {
                    controller: 'toolbarController',
                    templateUrl: 'static/partials/toolbar.html'
                },
                'edit@resourcerequest' : {
                    controller: 'resourceRequestFormController',
                    templateUrl: 'static/partials/resourcerequest.form.html'
                }
            },
            access: 'restricted'
            
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

        .state('education',{
            url: '/educations',
            views: {
                '' : {
                    controller: 'educationController',
                    templateUrl: 'static/partials/education.html'
                },
                'toolbar@education' : {
                    controller: 'toolbarController',
                    templateUrl: 'static/partials/toolbar.html'
                },
                'edit@education' : {
                    controller: 'educationFormController',
                    templateUrl: 'static/partials/education.form.html'
                },
                'skills@education' : {
                    controller: 'skillsController',
                    templateUrl: 'static/partials/skills.list.html'
                }
            }
        })
        .state('experience',{
            url: '/experiences',
            views: {
                '' : {
                    controller: 'experienceController',
                    templateUrl: 'static/partials/experience.html'
                },
                'toolbar@experience' : {
                    controller: 'toolbarController',
                    templateUrl: 'static/partials/toolbar.html'
                },
                'edit@experience' : {
                    controller: 'experienceFormController',
                    templateUrl: 'static/partials/experience.form.html'
                },
                'skills@experience' : {
                    controller: 'skillsController',
                    templateUrl: 'static/partials/skills.list.html'
                }
            }
        })

        .state('publication',{
            url: '/publications',
            views: {
                '' : {
                    controller: 'publicationController',
                    templateUrl: 'static/partials/publication.html'
                },
                'toolbar@publication' : {
                    controller: 'toolbarController',
                    templateUrl: 'static/partials/toolbar.html'
                },
                'edit@publication' : {
                    controller: 'publicationFormController',
                    templateUrl: 'static/partials/publication.form.html'
                },
                'skills@publication' : {
                    controller: 'skillsController',
                    templateUrl: 'static/partials/skills.list.html'
                }
            }
        })
        .state('workexperience',{
            url: '/workexperience',
            views: {
                '' : {
                    controller: 'workExperienceController',
                    templateUrl: 'static/partials/workexperience.html'
                },
                'toolbar@workexperience' : {
                    controller: 'toolbarController',
                    templateUrl: 'static/partials/toolbar.html'
                },
                'edit@workexperience' : {
                    controller: 'workExperienceFormController',
                    templateUrl: 'static/partials/workexperience.form.html'
                },
                'skills@workexperience' : {
                    controller: 'skillsController',
                    templateUrl: 'static/partials/skills.list.html'
                }
            }
        })

        .state('project',{
            url: '/projects',
            views: {
                '' : {
                    controller: 'projectController',
                    templateUrl: 'static/partials/project.html'
                },
                'toolbar@project' : {
                    controller: 'toolbarController',
                    templateUrl: 'static/partials/toolbar.html'
                },
                'edit@project' : {
                    controller: 'projectFormController',
                    templateUrl: 'static/partials/project.form.html'
                },
                'skills@project' : {
                    controller: 'skillsController',
                    templateUrl: 'static/partials/skills.list.html'
                }
            }
        })

        .state('merit',{
            url: '/merits',
            views: {
                '' : {
                    controller: 'meritController',
                    templateUrl: 'static/partials/merit.html'
                },
                'toolbar@merit' : {
                    controller: 'toolbarController',
                    templateUrl: 'static/partials/toolbar.html'
                },
                'edit@merit' : {
                    controller: 'meritFormController',
                    templateUrl: 'static/partials/merit.form.html'
                },
                'skills@merit' : {
                    controller: 'skillsController',
                    templateUrl: 'static/partials/skills.list.html'
                }
            }
        })

        .state('language',{
            url: '/languages',
            views: {
                '' : {
                    controller: 'languageController',
                    templateUrl: 'static/partials/language.html'
                },
                'toolbar@language' : {
                    controller: 'toolbarController',
                    templateUrl: 'static/partials/toolbar.html'
                },
                'edit@language' : {
                    controller: 'languageFormController',
                    templateUrl: 'static/partials/language.form.html'
                },
                'skills@language' : {
                    controller: 'skillsController',
                    templateUrl: 'static/partials/skills.list.html'
                }
            }
        })

        .state('skill',{
            url: '/skill',
            views: {
                '' : {
                    controller: 'skillController',
                    templateUrl: 'static/partials/skill.html'
                },
                'toolbar@skill' : {
                    controller: 'toolbarController',
                    templateUrl: 'static/partials/toolbar.html'
                },
                'edit@skill' : {
                    controller: 'skillFormController',
                    templateUrl: 'static/partials/skill.form.html'
                },
                'skills@skill' : {
                    controller: 'skillsController',
                    templateUrl: 'static/partials/skills.list.html'
                }
            }
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
            	},
                'competenceprofiles@profile' : {
                    controller: 'competenceProfilesController',
                    templateUrl: 'static/partials/competenceprofiles.html'
                },
                'editcompetenceprofile@profile' : {
                    controller: 'competenceProfilesController',
                    templateUrl: 'static/partials/competenceprofile.form.html'
                }

            },
            access: 'restricted'
        })

        
});


knowBase.run(function ($rootScope,$state, $cookies) {

	$rootScope.previousState;
    $rootScope.currentState;

	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        var today = new Date();
        var expired = new Date(today);
        expired.setDate(today.getDate() + 1);
        if(fromState.name != "" && fromState.name != "search"){
            $cookies.put('previousState', fromState.name, {expires : expired});
        }
		if (toState.access == 'restricted' && !$cookies.get('user')) {
			event.preventDefault();
		  	$state.go('start');
            
		}
	});
 


});

