angular.module('knowBase').controller('loginController',
  ['$scope', '$state', 'AuthService',
  function ($scope, $state, AuthService) {

    $scope.authed = AuthService.isLoggedIn();
    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;
      // call login from service
 
      AuthService.login($scope.loginController)
        // handle success
        .then(function () {
          $state.go('home');
          $scope.disabled = false;
          $scope.loginForm = {};
        },
        // handle error
        function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });

        
    };

}]);



angular.module('knowBase').controller('logoutController',
  ['$scope', '$state', 'AuthService',
  function ($scope, $state, AuthService) {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $state.go('login');
        });

    // };

}]);

angular.module('knowBase').controller('signupController',
  ['$scope', '$state', 'AuthService',


  function ($scope, $state, AuthService) {
    
    $scope.title = 'Signup';

    $scope.signup = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.signup($scope.signupController)
        // handle success
        .then(function () {

          // $state.path('/login');
          $scope.disabled = false;
          $scope.registerForm = {};
          $state.go('login');
        },
        // handle error
        function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

    };
}]);


angular.module('knowBase').controller('startController',
  ['$scope', '$state','$location','$anchorScroll', 'LocaleService',
    function ($scope, $state, $location, $anchorScroll) {
        $scope.welcome = 'Welcome to KnowBase';
        

        $scope.scrollTo = function(element){
          $location.hash(element);
          $anchorScroll();
        }
    }
  ]);


angular.module('knowBase').controller('activityfeedController',
  ['$scope', '$state',
  function ($scope, $state) {
    
}]);


angular.module('knowBase').controller('toolbarController',

  function ($scope, $state, $mdDialog, LocaleService, $cookies) {
    $scope.showSearch = false;
    $scope.languageMenuOpen = false;


    if($cookies.get('locale') === undefined){
      $cookies.put('locale', JSON.stringify({value: 'en-us',display: 'Eng'}), {expires : new Date().setDate(new Date() + 14)});
      LocaleService.setLocale('en-us')
        .then(function () {
          
        },
        // handle error
        function () {
          
        });
    }

    $scope.locale = JSON.parse($cookies.get('locale')).display;
    
    $scope.locales = [
      {value : 'en-us', display: 'Eng'},
      {value : 'sv', display: 'Swe'}
    ];

    $scope.toggleSearch = function(){
      $scope.showSearch = !$scope.showSearch;
    }

    $scope.setLocale = function(locale){
      $scope.locale = locale.display;
      $cookies.put('locale', JSON.stringify(locale), {expires : new Date().setDate(new Date() + 14)});
      LocaleService.setLocale(locale.value)
        .then(function () {
          
        },
        // handle error
        function () {
          
        });
    }

    

    $scope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    $('md-content').click(function(e){
      $scope.showSearch = false;
      $scope.$apply();
      
    });
});


angular.module('knowBase').controller('homeController',
  ['$scope', '$state', 'DataService',
  function ($scope, $state, DataService) {
    getProfile();


    function getProfile() {
        DataService.getProfile()
          .success(function (response) {
              $scope.data = response.data;
          })
          .error(function (error) {
              $scope.status = 'Unable to load profile data: ' + error.message;
          });
    }
}]);

angular.module('knowBase').controller('aboutController',
  ['$scope', '$state',
  function ($scope, $state) {
    $scope.title = 'About us';
}]);

angular.module('knowBase').controller('newsController',
  ['$scope', '$state',
  function ($scope, $state) {
    $scope.title = 'Latest news!';
}]);

angular.module('knowBase').controller('contactController',
  ['$scope', '$state',
  function ($scope, $state) {
    $scope.title = 'Contact us';
}]);

angular.module('knowBase').controller('educationController',
  function ($scope, $state, $http, $templateCache, DataService, $mdToast) {
    $scope.submitText = 'Update education';
    $scope.educations = [];
    $scope.titleLabel = 'Title';
    $scope.schoolLabel = 'School';
    $scope.startdateLabel = 'Start date';
    $scope.enddateLabel = 'End date';
    $scope.descriptionLabel = 'Description';

    //Title autocomplete stuff
    $scope.titles = [];
    $scope.selectedTitle = null;
    $scope.titleSearchText = null;
    $scope.titleSearchTextChanged = titleSearchTextChanged;
    $scope.titleSelectChanged = titleSelectChanged;
    $scope.titleQueryFilter = titleQueryFilter;

    //School autocomplete stuff
    $scope.schools = [];
    $scope.selectedSchool = null;
    $scope.schoolSearchText = null;
    $scope.schoolSearchTextChanged = schoolSearchTextChanged;
    $scope.schoolSelectChanged = schoolSelectChanged;
    $scope.schoolQueryFilter = schoolQueryFilter;

    var Education = function(e){
      var self = this;
      self.ideducation = e ? e.ideducation : null;
      self.title = e ? e.title : '';
      self.school = e ? e.school : '';
      self.startdate = e ? (e.startdate ? new Date(e.startdate) : null) : null;
      self.enddate = e ? (e.enddate ? new Date(e.enddate) : null) : null;
      self.description = e ? e.description : '';
    }

    function getEducations() {
      $scope.educations = [];
      $http({method: 'GET', url: '/api/educations', cache: $templateCache}).
        then(function(response) {
          $scope.status = response.status;
          $.each(response.data.data, function(i,e){
            $scope.educations.push(new Education(e));
          });
          // $scope.educations = response.data.data;
          // formatEducationData($scope.educations);
          $scope.title = 'Add all your educations';
        }, function(response) {
          $scope.data = response.data || "Request failed";
          $scope.status = response.status;
          if($scope.status == 404){
            $scope.title = 'No educations found. Try adding some to improve your CV!';
          }else{
            $scope.title = 'An unexpected error occurred.';
          }
      });
    }
    $scope.saveEducation = function(){
      DataService.saveSkill($scope.education,'education')
        .then(function () {
            $scope.success = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-success">Successfully saved education!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            });
            $scope.education = null;
            $scope.titleSearchText = null;
            $scope.schoolSearchText = null;
        },
        // handle error
        function (reason) {
            $scope.errorMessage = reason; 
            $scope.error = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to save education!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
        });
        $timeout(function () {
            getEducations();
            getOptions();
        }, 3000);
    }
    $scope.cancelEducation = function(){
      $scope.education = null;
      $scope.titleSearchText = null;
      $scope.schoolSearchText = null;
    }

    $scope.editEducation = function(e){
      $scope.education = e;
      $scope.titleSearchText = e.title;
      $scope.schoolSearchText = e.school;
    }

    $scope.newEducation = function(){
      $scope.education = new Education(null);
      $scope.titleSearchText = null;
      $scope.schoolSearchText = null; 
    }

    $scope.createFilterFor = function(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(option) {
        return (option.value.indexOf(lowercaseQuery) > -1);
      };
    }

    $scope.deleteRecord = function(){
      $http({method: 'DELETE', url: '/api/deleterecord?table=education&idrecord=' + $scope.education.ideducation})
        .then(function() {
          $scope.educations = $scope.educations
           .filter(function (o) {
                    return o.ideducation !== $scope.education.ideducation;
                   });
           $mdToast.show({
                template: '<md-toast class="md-toast-success">Education successfully removed!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
        }, 
        function(response) {
          $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to remove education!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
      });
    }

    function titleQueryFilter (query) {
      return query ? $scope.titles.filter( $scope.createFilterFor(query) ) : $scope.titles;
    }

    function titleSearchTextChanged(text){
      $scope.education.title = text;
    }

    function titleSelectChanged(item){
      if(item){
        $scope.selectedTitle = item;
        $scope.education.title = item.display;
      }
    }

    function schoolQueryFilter (query) {
      return query ? $scope.schools.filter( $scope.createFilterFor(query) ) : $scope.schools;
    }

    function schoolSearchTextChanged(text){
      $scope.education.school = text;
    }

    function schoolSelectChanged(item){
      if(item){
        $scope.selectedSchool = item;
        $scope.education.school = item.display;
      }
    }

    function getOptions(){
      // Titles
      $http({method: 'GET', url: '/api/options?table=education&field=title', cache: $templateCache}).
        then(function(response) {
          $scope.titles = response.data.data.map(function(t){
            return {display: t.option, value: t.option.toLowerCase()}
          });
          console.log($scope.titles)
        }, function(response) {
          console.log("error")    
      });
      // Schools
      $http({method: 'GET', url: '/api/options?table=education&field=school', cache: $templateCache}).
        then(function(response) {
          $scope.schools = response.data.data.map(function(t){
            return {display: t.option, value: t.option.toLowerCase()}
          });
        }, function(response) {
          console.log("error")    
      });
    }

    getOptions();
    getEducations();
});

angular.module('knowBase').controller('projectController',


  function ($scope, $state, $http, $templateCache, DataService, $mdToast) {
    $scope.submitText = 'Update work experience';
    $scope.projects = [];
    $scope.nameLabel = 'Name';
    $scope.customerLabel = 'Customer';
    $scope.startdateLabel = 'Start date';
    $scope.enddateLabel = 'End date';
    $scope.hoursLabel = 'Hours';
    $scope.descriptionLabel = 'Description';

    //Name autocomplete stuff
    $scope.names = [];
    $scope.selectedName = null;
    $scope.nameSearchText = null;
    $scope.nameSearchTextChanged = nameSearchTextChanged;
    $scope.nameSelectChanged = nameSelectChanged;
    $scope.nameQueryFilter = nameQueryFilter;

    //Customer autocomplete stuff
    $scope.customers = [];
    $scope.selectedCustomer = null;
    $scope.customerSearchText = null;
    $scope.customerSearchTextChanged = customerSearchTextChanged;
    $scope.customerSelectChanged = customerSelectChanged;
    $scope.customerQueryFilter = customerQueryFilter;

    var Project = function(o){
      var self = this;
      self.idproject = o ? o.idproject : null;
      self.name = o ? o.name : '';
      self.customer = o ? o.customer : null;
      self.customername = o ? o.customername : '';
      self.startdate = o ? (o.startdate ? new Date(o.startdate) : null) : null;
      self.enddate = o ? (o.enddate ? new Date(o.enddate) : null) : null;
      self.hours = o ? o.hours : 0;
      self.description = o ? o.description : '';
    }

    function getProjects() {
      $scope.projects = [];
      $http({method: 'GET', url: '/api/projects', cache: $templateCache}).
        then(function(response) {
          $scope.status = response.status;
          $.each(response.data.data, function(i,o){
            $scope.projects.push(new Project(o));
          });
          $scope.title = 'Add all your projects';
        }, function(response) {
          $scope.data = response.data || "Request failed";
          $scope.status = response.status;
          if($scope.status == 404){
            $scope.title = 'No projects found. Try adding some to improve your CV!';
          }else{
            $scope.title = 'An unexpected error occurred.';
          }
      });
    }
    $scope.saveProject = function(){

      DataService.saveSkill($scope.project, 'project')
        .then(function () {
            $scope.success = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-success">Successfully saved project!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            });
            $scope.project = null;
            $scope.nameSearchText = null;
            $scope.customerSearchText = null;
        },
        // handle error
        function (reason) {
            $scope.errorMessage = reason; 
            $scope.error = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to save project!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
        });
        $timeout(function () {
            getProjects();
            getOptions();
        }, 3000);
    }
    $scope.cancelProject = function(){
      $scope.project = null;
      $scope.nameSearchText = null;
      $scope.customerSearchText = null;
    }

    $scope.editProject = function(o){
      $scope.project = o;
      $scope.nameSearchText = o.name;
      $scope.customerSearchText = o.customername;
    }

    $scope.newProject = function(){
      $scope.project = new Project(null);
      $scope.nameSearchText = null;
      $scope.customerSearchText = null; 
    }

    $scope.createFilterFor = function(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(option) {
        return (option.value.indexOf(lowercaseQuery) > -1);
      };
    }

    $scope.deleteRecord = function(){
      $http({method: 'DELETE', url: '/api/deleterecord?table=project&idrecord=' + $scope.project.idproject})
        .then(function() {
          $scope.projects = $scope.projects
           .filter(function (o) {
                    return o.idproject !== $scope.project.idproject;
                   });
           $mdToast.show({
                template: '<md-toast class="md-toast-success">Project successfully removed!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
        }, 
        function(response) {
          $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to remove project!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
      });
    }

    function nameQueryFilter (query) {
      return query ? $scope.names.filter( $scope.createFilterFor(query) ) : $scope.names;
    }

    function nameSearchTextChanged(text){
      $scope.project.name = text;
    }

    function nameSelectChanged(item){
      if(item){
        $scope.selectedName = item;
        $scope.project.name = item.display;
      }
    }

    function customerQueryFilter (query) {
      return query ? $scope.customers.filter( $scope.createFilterFor(query) ) : $scope.customers;
    }

    function customerSearchTextChanged(text){
      $scope.project.customername = text;
    }

    function customerSelectChanged(item){
      if(item){
        $scope.selectedCustomer = item;
        $scope.project.customer = item.id;
        $scope.project.customername = item.display;
      }
    }

    function getOptions(){
      // Names
      $http({method: 'GET', url: '/api/options?table=project&field=name', cache: $templateCache}).
        then(function(response) {
          $scope.names = response.data.data.map(function(t){
            return {display: t.option, value: t.option.toLowerCase()}
          });
          console.log($scope.names)
        }, function(response) {
          console.log("error")    
      });
      // Customers
      $http({method: 'GET', url: '/api/customeroptions', cache: $templateCache}).
        then(function(response) {
          $scope.customers = response.data.data.map(function(t){
            return {display: t.name, value: t.name.toLowerCase(), id : t.idcustomer}
          });
        }, function(response) {
          console.log("error")    
      });
    }

    getOptions();
    getProjects();
});

angular.module('knowBase').controller('meritController',
  function ($scope, $state, $http, $templateCache, DataService, $mdToast) {
    $scope.submitText = 'Update merit';
    $scope.merits = [];
    $scope.nameLabel = 'Name';
    $scope.dateLabel = 'Start date';
    $scope.descriptionLabel = 'Description';

    //Name autocomplete stuff
    $scope.names = [];
    $scope.selectedName = null;
    $scope.nameSearchText = null;
    $scope.nameSearchTextChanged = nameSearchTextChanged;
    $scope.nameSelectChanged = nameSelectChanged;
    $scope.nameQueryFilter = nameQueryFilter;

    var Merit = function(m){
      var self = this;
      self.idmerit = m ? m.idmerit : null;
      self.name = m ? m.name : '';
      self.date = m ? (m.date ? new Date(m.date) : null) : null;
      self.description = m ? m.description : '';
    }

    function getMerits() {
      $scope.merits = [];
      $http({method: 'GET', url: '/api/merits', cache: $templateCache}).
        then(function(response) {
          $scope.status = response.status;
          $.each(response.data.data, function(i,m){
            $scope.merits.push(new Merit(m));
          });

          $scope.title = 'Add all your merits';
        }, function(response) {
          $scope.data = response.data || "Request failed";
          $scope.status = response.status;
          if($scope.status == 404){
            $scope.title = 'No merits found. Try adding some to improve your CV!';
          }else{
            $scope.title = 'An unexpected error occurred.';
          }
      });
    }
    $scope.saveMerit = function(){
      DataService.saveSkill($scope.merit, 'merit')
        .then(function () {
            $scope.success = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-success">Successfully saved merit!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            });
            $scope.merit = null;
            $scope.nameSearchText = null;
        },
        // handle error
        function (reason) {
            $scope.errorMessage = reason; 
            $scope.error = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to save merit!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
        });
        $timeout(function () {
            getMerits();
            getOptions();
        }, 3000);
    }
    $scope.cancelMerit = function(){
      $scope.merit = null;
      $scope.nameSearchText = null;
    }

    $scope.editMerit = function(m){
      $scope.merit = m;
      $scope.nameSearchText = m.name;
    }

    $scope.newMerit = function(){
      $scope.merit = new Merit(null);
      $scope.nameSearchText = null;
    }

    $scope.createFilterFor = function(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(option) {
        return (option.value.indexOf(lowercaseQuery) > -1);
      };
    }

    $scope.deleteRecord = function(){
      $http({method: 'DELETE', url: '/api/deleterecord?table=merit&idrecord=' + $scope.merit.idmerit})
        .then(function() {
          $scope.merits = $scope.merits
           .filter(function (o) {
                    return o.idmerit !== $scope.merit.idmerit;
                   });
           $mdToast.show({
                template: '<md-toast class="md-toast-success">Merit successfully removed!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
        }, 
        function(response) {
          $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to remove merit!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
      });
    }


    function nameQueryFilter (query) {
      return query ? $scope.names.filter( $scope.createFilterFor(query) ) : $scope.names;
    }

    function nameSearchTextChanged(text){
      $scope.merit.name = text;
    }

    function nameSelectChanged(item){
      if(item){
        $scope.selectedName = item;
        $scope.merit.name = item.display;
      }
    }

    function getOptions(){
      // Names
      $http({method: 'GET', url: '/api/options?table=merit&field=name', cache: $templateCache}).
        then(function(response) {
          $scope.names = response.data.data.map(function(t){
            return {display: t.option, value: t.option.toLowerCase()}
          });
          console.log($scope.names)
        }, function(response) {
          console.log("error")    
      });
    }

    getOptions();
    getMerits();
});

angular.module('knowBase').controller('experienceController',
  function ($scope, $state, $http, $templateCache, DataService, $mdToast) {
    $scope.submitText = 'Upstartdate experience';
    $scope.experiences = [];
    $scope.nameLabel = 'Name';
    $scope.startdateLabel = 'Start date';
    $scope.enddateLabel = 'End date';
    $scope.descriptionLabel = 'Description';

    //Name autocomplete stuff
    $scope.names = [];
    $scope.selectedName = null;
    $scope.nameSearchText = null;
    $scope.nameSearchTextChanged = nameSearchTextChanged;
    $scope.nameSelectChanged = nameSelectChanged;
    $scope.nameQueryFilter = nameQueryFilter;

    var Experience = function(o){
      var self = this;
      self.idexperience = o ? o.idexperience : null;
      self.name = o ? o.name : '';
      self.startdate = o ? (o.startdate ? new Date(o.startdate) : null) : null;
      self.enddate = o ? (o.enddate ? new Date(o.enddate) : null) : null;
      self.description = o ? o.description : '';
    }

    function getExperiences() {
      $scope.experiences = [];
      $http({method: 'GET', url: '/api/experiences', cache: $templateCache}).
        then(function(response) {
          $scope.status = response.status;
          $.each(response.data.data, function(i,o){
            $scope.experiences.push(new Experience(o));
          });
          console.log($scope.experiences)
          // $scope.experiences = response.data.data;
          // formatExperienceData($scope.experiences);
          $scope.title = 'Add all your experiences';
        }, function(response) {
          $scope.data = response.data || "Request failed";
          $scope.status = response.status;
          if($scope.status == 404){
            $scope.title = 'No experiences found. Try adding some to improve your CV!';
          }else{
            $scope.title = 'An unexpected error occurred.';
          }
      });
    }
    $scope.saveExperience = function(){
      DataService.saveSkill($scope.experience,'experience')
        .then(function () {
            $scope.success = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-success">Successfully saved experience!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            });
            $scope.experience = null;
            $scope.nameSearchText = null;
        },
        // handle error
        function (reason) {
            $scope.errorMessage = reason; 
            $scope.error = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to save experience!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
        });
        $timeout(function () {
            getExperiences();
            getOptions();
        }, 3000);
    }
    $scope.cancelExperience = function(){
      $scope.experience = null;
      $scope.nameSearchText = null;
    }

    $scope.editExperience = function(m){
      $scope.experience = m;
      $scope.nameSearchText = m.name;
    }

    $scope.newExperience = function(){
      $scope.experience = new Experience(null);
      $scope.nameSearchText = null;
    }

    $scope.deleteRecord = function(){
      console.log("HEJ")
      $http({method: 'DELETE', url: '/api/deleterecord?table=experience&idrecord=' + $scope.experience.idexperience})
        .then(function() {
          $scope.experiences = $scope.experiences
           .filter(function (o) {
                    return o.idexperience !== $scope.experience.idexperience;
                   });
           $mdToast.show({
                template: '<md-toast class="md-toast-success">Experience successfully removed!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
        }, 
        function(response) {
          $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to remove experience!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
      });
    }

    $scope.createFilterFor = function(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(option) {
        return (option.value.indexOf(lowercaseQuery) > -1);
      };
    }

    function nameQueryFilter (query) {
      return query ? $scope.names.filter( $scope.createFilterFor(query) ) : $scope.names;
    }

    function nameSearchTextChanged(text){
      $scope.experience.name = text;
    }

    function nameSelectChanged(item){
      if(item){
        $scope.selectedName = item;
        $scope.experience.name = item.display;
      }
    }

    function getOptions(){
      // Names
      $http({method: 'GET', url: '/api/options?table=experience&field=name', cache: $templateCache}).
        then(function(response) {
          $scope.names = response.data.data.map(function(t){
            return {display: t.option, value: t.option.toLowerCase()}
          });
          console.log($scope.names)
        }, function(response) {
          console.log("error")    
      });
    }

    getOptions();
    getExperiences();
});

angular.module('knowBase').controller('skillController',
  function ($scope, $state, $http, $templateCache, DataService, $mdToast, $timeout) {
    $scope.submitText = 'Update skill';
    $scope.skills = [];
    $scope.nameLabel = 'Name';
    $scope.levelLabel = 'Skill level';
    $scope.descriptionLabel = 'Description';
    $scope.skill = null;

    //Name autocomplete stuff
    $scope.names = [];
    $scope.selectedName = null;
    $scope.nameSearchText = null;
    $scope.nameSearchTextChanged = nameSearchTextChanged;
    $scope.nameSelectChanged = nameSelectChanged;
    $scope.nameQueryFilter = nameQueryFilter;

    var Skill = function(o){
      var self = this;
      self.idskill = o ? o.idskill : null;
      self.name = o ? o.name : '';
      self.level = o ? o.level : null;
      self.description = o ? o.description : '';
    }

    function getSkills() {
      $scope.skills = [];
      
      $http({method: 'GET', url: '/api/skills', cache: $templateCache}).
        then(function(response) {
          $scope.status = response.status;
          $.each(response.data.data, function(i,o){
            $scope.skills.push(new Skill(o));
          });
        
          $scope.title = 'Add all your skills';

        }, function(response) {
          $scope.data = response.data || "Request failed";
          $scope.status = response.status;
          if($scope.status == 404){
            $scope.title = 'No skills found. Try adding some to improve your CV!';
          }else{
            $scope.title = 'An unexpected error occurred.';
          }
      });
    }
    
    $scope.saveSkill = function(){
      DataService.saveSkill($scope.skill,'skill')
        .then(function () {
            $scope.success = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-success">Successfully saved skill!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            });

            $scope.skill = null;
            $scope.nameSearchText = null;
            // $state.transitionTo($state.current, params, { reload: true, inherit: true, notify: true })

        },
        // handle error
        function (reason) {
            $scope.errorMessage = reason; 
            $scope.error = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to save skill!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
        });
        $timeout(function () {
            getSkills();
            getOptions();
        }, 3000);
    }
    $scope.cancelSkill = function(){
      $scope.skill = null;
      $scope.nameSearchText = null;
    }

    $scope.editSkill = function(o){
      $scope.skill = o;
      $scope.nameSearchText = o.name;
    }

    $scope.newSkill = function(){
      $scope.skill = new Skill(null);
      $scope.nameSearchText = null;
    }

    $scope.createFilterFor = function(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(option) {
        return (option.value.indexOf(lowercaseQuery) > -1);
      };
    }

    $scope.deleteRecord = function(){
      $http({method: 'DELETE', url: '/api/deleterecord?table=skill&idrecord=' + $scope.skill.idskill})
        .then(function() {
          $scope.skills = $scope.skills
           .filter(function (o) {
                    return o.idskill !== $scope.skill.idskill;
                   });
           $mdToast.show({
                template: '<md-toast class="md-toast-success">Skill successfully removed!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
        }, 
        function(response) {
          $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to remove skill!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
      });
    }

    function nameQueryFilter (query) {
      return query ? $scope.names.filter( $scope.createFilterFor(query) ) : $scope.names;
    }

    function nameSearchTextChanged(text){
      $scope.skill.name = text;
    }

    function nameSelectChanged(item){
      if(item){
        $scope.selectedName = item;
        $scope.skill.name = item.display;
      }
    }

    function getOptions(){
      // Names
      $http({method: 'GET', url: '/api/options?table=skill&field=name', cache: $templateCache}).
        then(function(response) {
          $scope.names = response.data.data.map(function(t){
            return {display: t.option, value: t.option.toLowerCase()}
          });
          console.log($scope.names)
        }, function(response) {
          console.log("error")    
      });
    }

    getOptions();
    getSkills();
});

angular.module('knowBase').controller('workExperienceController',


  function ($scope, $state, $http, $templateCache, DataService, $mdToast) {
    $scope.submitText = 'Update work experience';
    $scope.workExperiences = [];
    $scope.titleLabel = 'Title';
    $scope.employerLabel = 'Employer';
    $scope.startdateLabel = 'Start date';
    $scope.enddateLabel = 'End date';
    $scope.descriptionLabel = 'Description';

    //Title autocomplete stuff
    $scope.titles = [];
    $scope.selectedTitle = null;
    $scope.titleSearchText = null;
    $scope.titleSearchTextChanged = titleSearchTextChanged;
    $scope.titleSelectChanged = titleSelectChanged;
    $scope.titleQueryFilter = titleQueryFilter;

    //Employer autocomplete stuff
    $scope.employers = [];
    $scope.selectedEmployer = null;
    $scope.employerSearchText = null;
    $scope.employerSearchTextChanged = employerSearchTextChanged;
    $scope.employerSelectChanged = employerSelectChanged;
    $scope.employerQueryFilter = employerQueryFilter;

    var WorkExperience = function(w){
      var self = this;
      self.idworkexperience = w ? w.idworkexperience : null;
      self.title = w ? w.title : '';
      self.employer = w ? w.employer : '';
      self.startdate = w ? (w.startdate ? new Date(w.startdate) : null) : null;
      self.enddate = w ? (w.enddate ? new Date(w.enddate) : null) : null;
      self.description = w ? w.description : '';
    }

    function getWorkExperiences() {
      $scope.workExperiences = [];
      $http({method: 'GET', url: '/api/workexperience', cache: $templateCache}).
        then(function(response) {
          $scope.status = response.status;
          $.each(response.data.data, function(i,w){
            $scope.workExperiences.push(new WorkExperience(w));
          });
          // $scope.workExperiences = response.data.data;
          // formatWorkExperienceData($scope.workExperiences);
          $scope.title = 'Add all your workExperiences';
        }, function(response) {
          $scope.data = response.data || "Request failed";
          $scope.status = response.status;
          if($scope.status == 404){
            $scope.title = 'No workExperiences found. Try adding some to improve your CV!';
          }else{
            $scope.title = 'An unexpected error occurred.';
          }
      });
    }
    $scope.saveWorkExperience = function(){
      DataService.saveSkill($scope.workExperience,'workexperience')
        .then(function () {
            $scope.success = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-success">Successfully saved workExperience!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            });
            $scope.workExperience = null;
            $scope.titleSearchText = null;
            $scope.employerSearchText = null;
        },
        // handle error
        function (reason) {
            $scope.errorMessage = reason; 
            $scope.error = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to save workExperience!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
        });
        $timeout(function () {
            getWorkExperiences();
            getOptions();
        }, 3000);
    }
    $scope.cancelWorkExperience = function(){
      $scope.workExperience = null;
      $scope.titleSearchText = null;
      $scope.employerSearchText = null;
    }

    $scope.editWorkExperience = function(w){
      $scope.workExperience = w;
      $scope.titleSearchText = w.title;
      $scope.employerSearchText = w.employer;
    }

    $scope.newWorkExperience = function(){
      $scope.workExperience = new WorkExperience(null);
      $scope.titleSearchText = null;
      $scope.employerSearchText = null; 
    }



    $scope.createFilterFor = function(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(option) {
        return (option.value.indexOf(lowercaseQuery) > -1);
      };
    }

    $scope.deleteRecord = function(){
      $http({method: 'DELETE', url: '/api/deleterecord?table=workexperience&idrecord=' + $scope.workExperience.idworkexperience})
        .then(function() {
          $scope.workExperiences = $scope.workExperiences
           .filter(function (o) {
                    return o.idworkexperience !== $scope.workExperience.idworkexperience;
                   });
           $mdToast.show({
                template: '<md-toast class="md-toast-success">Work experience successfully removed!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
        }, 
        function(response) {
          $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to remove work experience!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
      });
    }

    function titleQueryFilter (query) {
      return query ? $scope.titles.filter( $scope.createFilterFor(query) ) : $scope.titles;
    }

    function titleSearchTextChanged(text){
      $scope.workExperience.title = text;
    }

    function titleSelectChanged(item){
      if(item){
        $scope.selectedTitle = item;
        $scope.workExperience.title = item.display;
      }
    }

    function employerQueryFilter (query) {
      return query ? $scope.employers.filter( $scope.createFilterFor(query) ) : $scope.employers;
    }

    function employerSearchTextChanged(text){
      $scope.workExperience.employer = text;
    }

    function employerSelectChanged(item){
      if(item){
        $scope.selectedEmployer = item;
        $scope.workExperience.employer = item.display;
      }
    }

    function getOptions(){
      // Titles
      $http({method: 'GET', url: '/api/options?table=workExperience&field=title', cache: $templateCache}).
        then(function(response) {
          $scope.titles = response.data.data.map(function(t){
            return {display: t.option, value: t.option.toLowerCase()}
          });
          console.log($scope.titles)
        }, function(response) {
          console.log("error")    
      });
      // Employers
      $http({method: 'GET', url: '/api/options?table=workExperience&field=employer', cache: $templateCache}).
        then(function(response) {
          $scope.employers = response.data.data.map(function(t){
            return {display: t.option, value: t.option.toLowerCase()}
          });
        }, function(response) {
          console.log("error")    
      });
    }

    getOptions();
    getWorkExperiences();
});

angular.module('knowBase').controller('skillsController',
  function ($scope, $state, SkillService) {
    $scope.activeSkill = '';
    function getSkillTypes() {
        SkillService.getSkillTypes()
            .success(function (response) {
                $scope.skillTypes = response.data;
                $scope.tiles = buildGridModel({
                  icon : "fa-",
                  title: "",
                  background: ""
                });
            })
            .error(function (error) {
                
            });
    }
    
    function buildGridModel(tileTmpl){
      var it, results = [ ];

      $.each($scope.skillTypes,function(i,s){
        it = angular.extend({},tileTmpl);
        
        it.title = s.locale;
        it.span  = { row : 1, col : 1 };
        it.name = s.name;
        it.count = s.count;
        switch(s.name){
          case "education":
            it.background = "hue-2";
            it.icon  = it.icon + "graduation-cap";
            it.span.row = 2;
            break;
          case "workexperience": 
            it.background = "hue-3";  
            it.icon  = it.icon + "suitcase";   
            it.span.row = 2;    
            break;
          case "experience": 
            it.icon  = it.icon + "certificate";
            it.background = "hue-1";      
            break;
          case "project":
            it.icon  = it.icon + "tasks";
            it.background = "hue-3";
            it.span.col = 2;
            break;
          case "language":
            it.background = "hue-2";
            it.icon  = it.icon + "comment-o";
            break;
          case "publication": 
            it.background = "hue-2";
            it.icon  = it.icon + "book";         
            break;
          case "skill": 
            it.background = "hue-1";      
            it.icon  = it.icon + "key";
            it.span.col = 2;
            break;
          case "merit":
            it.background= "hue-3";
            it.icon = it.icon + "star"
            break;
          }
        results.push(it); 
      });
      return results;
    }

    $scope.setActiveSkill = function(skill){
      console.log(skill)
      $scope.activeSkill = skill;
    }

    getSkillTypes();


});


function profilePictureController($scope, $mdDialog, DataService) {
  $scope.myImage='';
  $scope.myCroppedImage='';
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    var uploadImg = $scope.beforeUpload($scope.myCroppedImage)
    DataService.uploadPicture(uploadImg);
    $('#profilepicture').attr('src',$scope.myCroppedImage);
    $('#profilepicture').show();
    $mdDialog.hide(answer);
  };

  $scope.fileSelected = function(file) {
    if(file){
      var imgReader = new FileReader();
      imgReader.onload = function (image) {
        $scope.$apply(function($scope){
          $scope.myImage=image.target.result;
        });
      };
      imgReader.readAsDataURL(file);

      $scope.fileName = file.name;
    }
  };

  $scope.beforeUpload = function(img){
    var fileType = img.split('/')[1].split(';')[0];
    var data = img.split(',')[1];
    return {extension: fileType, data: data};
  }


  $scope.selectFile = function(){
    $('#fileInput').click();
  }
}



angular.module('knowBase').controller('profileController',
  function ($scope, $state, $timeout, DataService, $mdDialog, $mdMedia, $http, $templateCache, $mdToast) {
    $scope.title = 'Profile';
    $scope.profileTab = 'info';
    $scope.imgsrc = '';

    function getProfile() {
      DataService.getProfile()
          .success(function (response) { 
              $scope.profile = new Profile(response.data);
          })
          .error(function (error) {
              $scope.status = 'Unable to load profile data: ' + error.message;
          });
    }

    var Profile = function(p){
      var self = this;
      self.idprofile = p.idprofile;
      self.firstname = p.firstname;
      self.lastname = p.lastname;
      self.phone = p.phone;
      self.mobilephone = p.mobilephone;
      self.address = p.address;
      self.city = p.city;
      self.country = p.country;
      self.birthdate = p.birthdate ? new Date(p.birthdate) : null;
    }

    $http({method: 'GET', url: '/api/profilepicture', cache: $templateCache})
    .then(function(response) {

        $scope.status = response.status;
        var response = response.data;
        var data = response.data;
        var extension = response.extension;
        if(data !== null){
          $scope.imgsrc = 'data:image/' + extension + ';base64,' + data;
          $('#profilepicture').show();
          $('#profilepicture').attr('src',$scope.imgsrc);
        }else{
          $('#profilepicture').hide();
        }

      }, function(response) {
        $scope.img = response.data || "Request failed";
        $scope.status = response.status;

    });

  

    $scope.updateProfile = function(){
      DataService.updateProfile($scope.profile)
        .then(function () {
            $scope.success = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-success">Successfully updated profile!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            });
        },
        // handle error
        function (reason) {
            $scope.errorMessage = reason; 
            $scope.error = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to update profile!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
        });
    }

    $scope.uploadPicture = function(ev){
      $mdDialog.show({
        controller: profilePictureController,
        templateUrl: '/static/partials/profilepicture.templ.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: $mdMedia('sm') && $scope.customFullscreen
      })
      .then(function(answer) {
        $scope.status = 'Success';
      }, function() {
        $scope.status = 'Fail';
      });
      $scope.$watch(function() {
        return $mdMedia('sm');
      }, function(sm) {
        $scope.customFullscreen = (sm === true);
      });
    };

    

    getProfile();
})
