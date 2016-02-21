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


    if(!$cookies.get('locale')){
      $cookies.put('locale', JSON.stringify({value: 'en-us',display: 'Eng'}), {expires : new Date().setDate(new Date() + 14)});
      LocaleService.setLocale('en-us')
        .then(function () {
          
        },
        // handle error
        function () {
          
        });
    }
    console.log($cookies.get('locale'));
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
          $state.go($state.current, {}, {reload: true});
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
    $scope.date = null;//new Date();

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
    $scope.educationLabel = 'Education';
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

    //Education autocomplete stuff
    $scope.educationValues = [];
    $scope.selectedEducation = null;
    $scope.educationSearchText = null;
    $scope.educationSearchTextChanged = educationSearchTextChanged;
    $scope.educationSelectChanged = educationSelectChanged;
    $scope.educationQueryFilter = educationQueryFilter;

    var Education = function(e){
      var self = this;
      self.ideducation = e ? e.ideducation : null;
      self.title = e ? e.title : '';
      self.education = e ? e.education : '';
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
        .then(function (data) {
            $scope.success = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-success">Successfully saved education!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            });
            if(!$scope.education.ideducation){
              $scope.education.ideducation = data.idrecord;
              $scope.educations.push($scope.education);
            }
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
    }
    
    $scope.cancelEducation = function(){
      $scope.education = null;
      $scope.titleSearchText = null;
      $scope.selectedTitle = null;
      $scope.selectedSchool = null;
      $scope.schoolSearchText = null;
      $scope.selectedEducation = null;
      $scope.educationSearchText = null;
    }

    $scope.editEducation = function(e){
      console.log(e);
      $scope.education = e;
      $scope.titleSearchText = e.title;
      $scope.schoolSearchText = e.school;
      $scope.educationSearchText = e.education;
    }

    $scope.newEducation = function(){
      $scope.education = new Education(null);
      $scope.titleSearchText = null;
      $scope.schoolSearchText = null; 
      $scope.educationSearchText = null;
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
           $scope.education = null;
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

    function educationQueryFilter (query) {
      return query ? $scope.educationValues.filter( $scope.createFilterFor(query) ) : $scope.educationValues;
    }

    function educationSearchTextChanged(text){
      $scope.education.education = text;
    }

    function educationSelectChanged(item){
      if(item){
        $scope.selectedEducation = item;
        $scope.education.education = item.display;
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

      //Educations
      $http({method: 'GET', url: '/api/options?table=education&field=education', cache: $templateCache}).
        then(function(response) {
          $scope.educationValues = response.data.data.map(function(t){
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
      self.customername = o ? o.customer.name : '';
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
        .then(function (data) {
            $scope.success = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-success">Successfully saved project!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            });
            if(!$scope.project.idproject){
              $scope.project.idproject = data.idrecord;
              $scope.projects.push($scope.project);
            }
            $scope.project = null;
            $scope.nameSearchText = null;
            $scope.customerSearchText = null;
            $scope.selectedCustomer = null;
            $scope.selectedName = null;
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
    }
    $scope.cancelProject = function(){
      $scope.project = null;
      $scope.selectedName = null;
      $scope.selectedCustomer = null;
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
           $scope.project = null;
           $scope.selectedCustomer = null;
           $scope.selectedName = null;
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
      var matches = customerQueryFilter(text);
      if(matches.length > 0){
        $scope.project.customer = matches[0].value == angular.lowercase(text) ? matches[0] : null;
      }
      else{
        $scope.project.customer = null;
      }
      
      $scope.project.customername = text;
    }

    function customerSelectChanged(item){
      if(item){
        $scope.selectedCustomer = item;
        $scope.project.customer = item;
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
        }, function(response) {
          console.log("error")    
      });
      // Customers
      $http({method: 'GET', url: '/api/customers', cache: $templateCache}).
        then(function(response) {
          $scope.customers = response.data.data.map(function(t){
            return {display: t.name, value: t.name.toLowerCase(), idcustomer : t.idcustomer}
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
        .then(function (data) {
            $scope.success = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-success">Successfully saved merit!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            });
            if(!$scope.merit.idmerit){
              $scope.merit.idmerit = data.idrecord;
              $scope.merits.push($scope.merit);
            }
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
    }
    $scope.cancelMerit = function(){
      $scope.merit = null;
      $scope.selectedName = null;
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
           $scope.merit = null;
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
        .then(function (data) {
            $scope.success = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-success">Successfully saved experience!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            });
            if(!$scope.experience.idexperience){
              $scope.experience.idexperience = data.idrecord;
              $scope.experiences.push($scope.experience);
            }
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
    }
    $scope.cancelExperience = function(){
      $scope.experience = null;
      $scope.selectedName = null;
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
           $scope.experience = null;
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

angular.module('knowBase').controller('languageController',
  function ($scope, $state, $http, $templateCache, DataService, $mdToast, $timeout) {
    $scope.submitText = 'Update language';
    $scope.languages = [];
    $scope.languageLabel = 'Language';
    $scope.writingLabel = 'Writing profficiency';
    $scope.listeningLabel = 'Listening profficiency';
    $scope.readingLabel = 'Reading profficiency';
    $scope.conversationLabel = 'Conversation profficiency';
    $scope.verbalLabel = 'Verbal production';
    $scope.language = null;

    //Name autocomplete stuff
    $scope.languageValues = [];
    $scope.selectedLanguage = null;
    $scope.languageSearchText = null;
    $scope.languageSearchTextChanged = languageSearchTextChanged;
    $scope.languageSelectChanged = languageSelectChanged;
    $scope.languageQueryFilter = languageQueryFilter;

    $scope.levels = [
      "A1",
      "A2",
      "B1",
      "B2",
      "C1",
      "C2"
    ].map(function (level) { return { level: level }; });

    var Language = function(o){
      var self = this;
      self.idlanguage = o ? o.idlanguage : null;
      self.language = o ? o.language : '';
      self.writing = o ? o.writing : '';
      self.listening = o ? o.listening : '';
      self.reading = o ? o.reading : '';
      self.conversation = o ? o.conversation : '';
      self.verbal = o ? o.verbal : '';
    }

    function getLanguages() {
      $scope.languages = [];
      
      $http({method: 'GET', url: '/api/languages', cache: $templateCache}).
        then(function(response) {
          $scope.status = response.status;
          $.each(response.data.data, function(i,o){
            $scope.languages.push(new Language(o));
          });
          console.log(response.data.data)
          $scope.title = 'Add all your languages';

        }, function(response) {
          $scope.data = response.data || "Request failed";
          $scope.status = response.status;
          if($scope.status == 404){
            $scope.title = 'No languages found. Try adding some to improve your CV!';
          }else{
            $scope.title = 'An unexpected error occurred.';
          }
      });
    }
    
    $scope.saveLanguage = function(){
      DataService.saveSkill($scope.language,'language')
        .then(function (data) {
            $scope.success = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-success">Successfully saved language!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            });
            if(!$scope.language.idlanguage){
              $scope.language.idlanguage = data.idrecord;
              $scope.languages.push($scope.language);
            }
            $scope.language = null;
            $scope.nameSearchText = null;
            // $state.transitionTo($state.current, params, { reload: true, inherit: true, notify: true })

        },
        // handle error
        function (reason) {
            $scope.errorMessage = reason; 
            $scope.error = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to save language!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
        });
    }
    $scope.cancelLanguage = function(){
      $scope.language = null;
      $scope.selectedLanguage = null;
      $scope.languageSearchText = null;
    }

    $scope.editLanguage = function(o){
      $scope.language = o;
      $scope.languageSearchText = o.language;
    }

    $scope.newLanguage = function(){
      $scope.language = new Language(null);
      $scope.languageSearchText = null;
    }

    $scope.createFilterFor = function(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(option) {
        return (option.value.indexOf(lowercaseQuery) > -1);
      };
    }

    $scope.deleteRecord = function(){
      $http({method: 'DELETE', url: '/api/deleterecord?table=language&idrecord=' + $scope.language.idlanguage})
        .then(function() {
          $scope.languages = $scope.languages
           .filter(function (o) {
                    return o.idlanguage !== $scope.language.idlanguage;
                   });
           $mdToast.show({
                template: '<md-toast class="md-toast-success">Language successfully removed!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
           $scope.language = null;
        }, 
        function(response) {
          $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to remove language!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
      });
    }

    function languageQueryFilter (query) {
      return query ? $scope.languageValues.filter( $scope.createFilterFor(query) ) : $scope.languageValues;
    }

    function languageSearchTextChanged(text){
      $scope.language.language = text;
    }

    function languageSelectChanged(item){
      if(item){
        $scope.selectedLanguage = item;
        $scope.language.language = item.display;
      }
    }

    function getOptions(){
      // Names
      $http({method: 'GET', url: '/api/options?table=language&field=language', cache: $templateCache}).
        then(function(response) {
          $scope.languageValues = response.data.data.map(function(t){
            return {display: t.option, value: t.option.toLowerCase()}
          });
          console.log($scope.languageValues)
        }, function(response) {
          console.log("error")    
      });
    }

    getOptions();
    getLanguages();
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

    $scope.levels = [
      "1",
      "2",
      "3",
      "4",
      "5"
    ].map(function (level) { return { level: level }; });

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
        .then(function (data) {
            $scope.success = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-success">Successfully saved skill!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            });
            if(!$scope.skill.idskill){
              $scope.skill.idskill = data.idrecord;
              $scope.skills.push($scope.skill);
            }
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
    }
    $scope.cancelSkill = function(){
      $scope.skill = null;
      $scope.selectedName = null;
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
           $scope.skill = null;
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
          console.log($scope.workExperiences)
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
        .then(function (data) {
            $scope.success = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-success">Successfully saved workExperience!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            });
           
            if(!$scope.workExperience.idworkexperience){
              $scope.workExperience.idworkexperience = data.idrecord;
              $scope.workExperiences.push($scope.workExperience);
            }
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
    }
    $scope.cancelWorkExperience = function(){
      $scope.workExperience = null;
      $scope.selectedTitle = null;
      $scope.selectedEmployer = null;
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
           $scope.workExperience = null;
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

angular.module('knowBase').controller('publicationController',
  function ($scope, $state, $http, $templateCache, DataService, $mdToast) {
    $scope.submitText = 'Update publication';
    $scope.publications = [];
    $scope.titleLabel = 'Title';
    $scope.authorLabel = 'Author list';
    $scope.dateLabel = 'Publication date';
    $scope.descriptionLabel = 'Description';
    $scope.publicationLabel = 'Published in';

    //Title autocomplete stuff
    $scope.titles = [];
    $scope.selectedTitle = null;
    $scope.titleSearchText = null;
    $scope.titleSearchTextChanged = titleSearchTextChanged;
    $scope.titleSelectChanged = titleSelectChanged;
    $scope.titleQueryFilter = titleQueryFilter;


    var Publication = function(e){
      var self = this;
      self.idpublication = e ? e.idpublication : null;
      self.authors = e ? e.authors : '';
      self.title = e ? e.title : '';
      self.date = e ? (e.date ? new Date(e.date) : null) : null;
      self.description = e ? e.description : '';
      self.publication = e ? e.publication : '';
    }

    function getPublications() {
      $scope.publications = [];
      $http({method: 'GET', url: '/api/publications', cache: $templateCache}).
        then(function(response) {
          $scope.status = response.status;
          $.each(response.data.data, function(i,e){
            $scope.publications.push(new Publication(e));
          });
          $scope.title = 'Add all your publications';
        }, function(response) {
          $scope.data = response.data || "Request failed";
          $scope.status = response.status;
          if($scope.status == 404){
            $scope.title = 'No publications found. Try adding some to improve your CV!';
          }else{
            $scope.title = 'An unexpected error occurred.';
          }
      });
    }

    $scope.savePublication = function(){
      DataService.saveSkill($scope.publication,'publication')
        .then(function (data) {
            console.log(data)
            $scope.success = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-success">Successfully saved publication!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            });

            if(!$scope.publication.idpublication){
              $scope.publication.idpublication = data.idrecord;
              $scope.publications.push($scope.publication);
            }

            $scope.publication = null;
            $scope.titleSearchText = null;
            $scope.schoolSearchText = null;
        },
        // handle error
        function (reason) {
            $scope.errorMessage = reason; 
            $scope.error = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to save publication!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
        });

    }

    $scope.cancelPublication = function(){
      $scope.publication = null;
      $scope.selectedTitle = null;
      $scope.titleSearchText = null;
    }

    $scope.editPublication = function(e){
      $scope.publication = e;
      $scope.titleSearchText = e.title;
      $scope.schoolSearchText = e.school;
    }

    $scope.newPublication = function(){
      $scope.publication = new Publication(null);
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
      $http({method: 'DELETE', url: '/api/deleterecord?table=publication&idrecord=' + $scope.publication.idpublication})
        .then(function() {
          $scope.publications = $scope.publications
           .filter(function (o) {
                    return o.idpublication !== $scope.publication.idpublication;
                   });
           $mdToast.show({
                template: '<md-toast class="md-toast-success">Publication successfully removed!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
           $scope.publication = null;
        }, 
        function(response) {
          $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to remove publication!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
      });
    }

    function titleQueryFilter (query) {
      return query ? $scope.titles.filter( $scope.createFilterFor(query) ) : $scope.titles;
    }

    function titleSearchTextChanged(text){
      $scope.publication.title = text;
    }

    function titleSelectChanged(item){
      if(item){
        $scope.selectedTitle = item;
        $scope.publication.title = item.display;
      }
    }

    function getOptions(){
      // Titles
      $http({method: 'GET', url: '/api/options?table=publication&field=title', cache: $templateCache}).
        then(function(response) {
          $scope.titles = response.data.data.map(function(t){
            return {display: t.option, value: t.option.toLowerCase()}
          });
          console.log($scope.titles)
        }, function(response) {
          console.log("error")    
      });
    }

    getOptions();
    getPublications();
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

    $scope.togglePage = function(){
      console.log("test1")
      $('#list-column').toggleClass("hide");
      $('#skill-column').toggleClass("hide");

      $('.tab-selector').toggleClass("selected");
      
      if($('#skill-column').attr('hide')){
        console.log("removed")
        $('#skill-column').removeAttr('hide');
      }else{
        $('#skill-column').attr('hide','true');
      }
      console.log("test2")

    }

    $scope.setActiveSkill = function(skill){
      console.log(skill)
      // $scope.togglePage();
      $scope.activeSkill = skill;
      
    }

    getSkillTypes();
    console.log("skill:")
    console.log($scope.activeSkill)
    console.log("/")

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

    $('#tab-control').on('hide',function(){
      console.log("hej")
      $('#right-column').show();
      $('#left-column').show();

    });

    function getProfile() {
      DataService.getProfile()
          .success(function (response) { 
              $scope.profile = new Profile(response.data);
          })
          .error(function (error) {
              $scope.status = 'Unable to load profile data: ' + error.message;
          });
    }

    $scope.togglePage = function($event){

      $('#profile-column').toggleClass("hide");
      $('#messages-column').toggleClass("hide");

      $('.tab-selector').toggleClass("selected");
      
      if($('#messages-column').attr('hide')){
        $('#messages-column').removeAttr('hide');
      }else{
        $('#messages-column').attr('hide','true');
      }

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
      self.zipcode = p.zipcode;
      self.country = p.country;
      self.birthdate = p ? (p.birthdate ? new Date(p.birthdate) : null) : null;
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
