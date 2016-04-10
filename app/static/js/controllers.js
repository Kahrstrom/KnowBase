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




angular.module('knowBase').controller('searchController',
  function ($scope, $state, $http,  DataService, $mdToast, $cookies, $mdSidenav, $mdDialog) {
    $scope.searchval = "";
    $scope.competenceProfileTabIndex = 2;
    $scope.profileTabIndex = 3;
    $scope.back = function(){
      $state.go($cookies.get('previousState') ? $cookies.get('previousState') : 'home');
    }
    $scope.toggleRightWide = buildToggler('right-wide');
    $scope.toggleRight = buildToggler('right');
    $scope.toggleLeft = buildToggler('left');
    $scope.groupProfiles = true;
    function buildToggler(navID) {

      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            
          });
      }
    }

    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };

    $scope.filterResults = function(items, idprofile){
      
      return items.filter(function(obj){
        return obj.profile.idprofile == idprofile;
      });
    }

    $scope.search = function(){

      if($scope.searchval != ""){
        DataService.searchData({query: $scope.searchval})
          .then(function (data) {
              $scope.educations = data.educations;
              $scope.skills = data.skills;
              $scope.workexperiences = data.workexperiences;
              $scope.publications = data.publications;
              $scope.experiences = data.experiences;
              $scope.merits = data.merits;
              $scope.languages = data.languages;
              $scope.projects = data.projects;
              $scope.profiles = data.profiles;
              console.log($scope.profiles)
          },
          // handle error
          function (reason) {

          });
        }
        else{
          $scope.educations = [];
          $scope.skills = [];
          $scope.workexperiences = [];
          $scope.publications = [];
          $scope.experiences = [];
          $scope.merits = [];
          $scope.languages = [];
          $scope.projects = [];
          $scope.profiles = [];
        }
    }

    $scope.showConfirm = function(ev, resourceRequest) {
      
      var confirm = $mdDialog.confirm()
            .title('Add candidate?')
            .textContent('Do you want to add ' + $scope.candidate.descriptive_header + ' as a candidate to the resource request?')
            .ariaLabel('Add Candidate')
            .targetEvent(ev)
            .ok('Yes')
            .cancel('No');
      $mdDialog.show(confirm).then(function() {
        var candidate = new DataService.Candidate(null)
        candidate.competenceprofile = $scope.candidate; 
        candidate.resourcerequest =  resourceRequest;
        candidate.rate = 0;
        DataService.saveSkill(candidate,'candidates')
          .then(function(response){
            $scope.toggleRightWide();
          },function(response){

          });
      }, function() {
        
      });
    };

    $scope.edit = function(item){
      $scope.selected = item;
      $scope.toggleRight();
    }

    $scope.showProfile = function(profile){
      $scope.idprofile = profile.idprofile;
      $scope.competenceprofile = null;
      $scope.toggleLeft();
    }

    $scope.setCompetenceProfile = function(competenceprofile){
      $scope.selected = null;
      $scope.idcompetenceprofile = competenceprofile.idcompetenceprofile;
      $scope.candidate = competenceprofile;
      $scope.toggleRightWide();
    }

    $scope.showCompetenceProfile = function(competenceprofile){
      $scope.idprofile = null;

      $scope.competenceprofile = competenceprofile;
    }

    $scope.cancelCompetenceProfile = function(){
      $scope.idprofile = $scope.competenceprofile.profile;
      $scope.competenceprofile = null;
    }

    $scope.cancelSkill = function(){
      $scope.selected = null;
      $scope.toggleRight();
    }

    $scope.cancelProfile = function(){
      $scope.idprofile = null;
      $scope.toggleLeft();
    }

    $scope.getImg = function(imgData){
      return 'data:image/' + imgData.extension + ';base64,' + imgData.data;
    }

});

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


angular.module('knowBase').controller('resourceRequestFormController',
  function ($scope,$state,$http,DataService,$mdToast){
    $scope.submitText = 'Update work experience';
    $scope.titleLabel = 'Title';
    $scope.contactnameLabel = 'Contact name';
    $scope.contactemailLabel = 'Contact email';
    $scope.startdateLabel = 'Start date';
    $scope.externallinkLabel = 'External link';
    $scope.enddateLabel = 'End date';
    $scope.descriptionLabel = 'Description';
    $scope.customerLabel = 'Customer';

    //Customer autocomplete stuff
    $scope.customers = [];
    $scope.selectedCustomer = null;
    $scope.customerSearchText = null;
    $scope.customerSearchTextChanged = customerSearchTextChanged;
    $scope.customerSelectChanged = customerSelectChanged;
    $scope.customerQueryFilter = customerQueryFilter;

    $scope.candidates = [];

    $scope.$parent.$watch('selected',function(newVal,oldVal){
      $scope.resourceRequest = new DataService.ResourceRequest(newVal);
      $scope.customerSearchText = newVal ? $scope.resourceRequest.customer.name : null;
      getOptions();
      getCandidates();
    });

    $scope.saveResourceRequest = function(){
      console.log($scope.resourceRequest)
      DataService.saveSkill($scope.resourceRequest,'resourcerequest')
        .then(function (data) {
            $state.go('resourcerequest',{},{reload:true});

        },
        // handle error
        function (reason) {
            $scope.errorMessage = reason; 
            $scope.error = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to save resource request!</md-toast>',
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

    function customerQueryFilter (query) {
      return query ? $scope.customers.filter( $scope.createFilterFor(query) ) : $scope.customers;
    }

    function customerSearchTextChanged(text){
      var matches = customerQueryFilter(text);
      if(matches.length > 0){
        $scope.resourceRequest.customer = matches[0].value == angular.lowercase(text) ? matches[0] : null;
      }
      else{
        $scope.resourceRequest.customer = null;
      }
      
      $scope.resourceRequest.customername = text;
    }

    function customerSelectChanged(item){
      if(item){
        $scope.selectedCustomer = item;
        $scope.resourceRequest.customer = item;
        $scope.resourceRequest.customername = item.display;
      }
    }

    function getOptions(){
      // Customers
      $http(DataService.request('GET','customers')).
        then(function(response) {

          $scope.customers = response.data.data.map(function(t){
            return {display: t.name, value: t.name.toLowerCase(), idcustomer : t.idcustomer}
          });
          console.log($scope.customers)
        }, function(response) {
              
      });
    }

    function getCandidates(){
      // Candidates
      $http(DataService.request('GET','candidates?resourcerequest=' + $scope.resourceRequest.idresourcerequest))
        .then(function(response){
          $scope.candidates = [];
          $scope.status = response.status;
          $.each(response.data.data, function(i,c){
            $scope.candidates.push(new DataService.Candidate(c));
          });
        }, function(response){

        });
    }
    
    $scope.cancel = function(){
      $scope.$parent.toggleRight();
    }

    $scope.deleteRecord = function(){
      $http(DataRequest.request('DELETE', 'deleterecord?table=resourceRequest&idrecord=' + $scope.resourceRequest.idresourcerequest))
        .then(function() {
            $state.go('resourcerequest');
        }, 
        function(response) {
          $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to remove work experience!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
      });
    }
    
  }
);


angular.module('knowBase').controller('resourceRequestController',
  function ($scope, $state, DataService, $cookies, $http, $mdSidenav) {
    
    $scope.siteLabel = 'Resource requests';
    DataService.getResourceRequests()
    .then(function(response){
      $scope.resourceRequests = [];
      $scope.status = response.status;
      $.each(response.data.data, function(i,r){
        $scope.resourceRequests.push(new DataService.ResourceRequest(r));
      });
    }, function(){
      console.log('error')
    })

    $scope.toggleRight = buildToggler('right');

    function buildToggler(navID) {

      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            
          });
      }
    }

    $scope.addCandidate = function($event,resourceRequest){
      $scope.$parent.showConfirm($event,resourceRequest);
    }

    $scope.edit = function(e){
      $scope.selected = e;
      $scope.toggleRight();
      
    }

    $scope.new = function(){
      $scope.selected = new DataService.ResourceRequest(null);
      $scope.toggleRight();
    }
});


angular.module('knowBase').controller('toolbarController',

  function ($scope, $state, $mdDialog, LocaleService, $cookies) {
    $scope.showSearch = false;
    $scope.languageMenuOpen = false;

    $scope.$parent.$watch('siteLabel', function(newValue, oldValue){
      $scope.siteLabel = newValue;
    });

    if(!$cookies.get('locale')){
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
});

angular.module('knowBase').controller('detailsController',
  function ($scope, $state, DataService, $window, $http) {
    $scope.profile = null;
    $scope.$parent.$watch('idprofile', function(newValue, oldValue){
      if(newValue !== undefined){
        $scope.hasParent = true;
      }else{
        $scope.hasParent = false;
      }
      console.log($scope.profile)
      $scope.idprofile = newValue;
      $scope.tabIndex = $scope.$parent.profileTabIndex;
      $scope.imgData = null;
      getProfile();
      console.log($scope.profile)
    });
    
    function getProfile() {
        DataService.getProfile($scope.idprofile)
          .success(function (response) {
              $scope.profile = response.data;

              var response = response.data;
              console.log($scope.profile)
              $scope.imgData = 'data:image/' + $scope.profile.profilepicture.extension + ';base64,' + $scope.profile.profilepicture.data;

              $scope.competenceProfiles = [];
              DataService.getCompetenceProfiles($scope.idprofile)
                .success(function (response) {
                  $.each(response.data, function(i,p){
                    $scope.competenceProfiles.push(new DataService.CompetenceProfile(p));
                  });
                })
                .error(function (error) {
                  $scope.status = 'Unable to load profile data: ' + error.message;
                });
                1
          })
          .error(function (error) {
              $scope.status = 'Unable to load profile data: ' + error.message;
          });
    }


    $scope.getImg = function(){
      
      var imgData = $scope.profile.profilepicture;
      return 'data:image/' + imgData.extension + ';base64,' + imgData.data;
  
    }
    $scope.openGoogleMaps = function() { 
      var queryParameter = encodeURIComponent($scope.profile.address + '+' + $scope.profile.zipcode + '+' + $scope.profile.city + '+' + $scope.profile.country);
      $window.open('http://maps.google.com/?q='+queryParameter , '_blank');
    }
    $scope.phoneCall = function(number) { 
      var link = 'tel:' + number;
      window.location.href = link;
    }
    $scope.email = function() { 
      var link = 'mailto:' + $scope.profile.email;
      window.location.href = link;
    }

    $scope.showCompetenceProfile = function(competenceprofile){
      $scope.$parent.showCompetenceProfile(competenceprofile);
    }

    $scope.cancelProfile = function(){
      $scope.$parent.cancelProfile();
    }

    $scope.setCompetenceProfile = function(competenceprofile){

      $scope.$parent.setCompetenceProfile(competenceprofile);
    }

  
});


angular.module('knowBase').controller('homeController',
  function ($scope, $state, DataService) {
    $scope.siteLabel = 'Overview';
    
    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }
    }

    $scope.test = "testar";
    $scope.toggleLeft = buildToggler('left');
});

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

angular.module('knowBase').controller('dashboardController',
  function ($scope, $state) {
    
});


angular.module('knowBase').controller('educationFormController',
  function ($scope,$state,$http,DataService,$mdToast){
    $scope.submitText = 'Update education';
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

    $scope.$parent.$watch('selected',function(newVal,oldVal){
      $scope.education = new DataService.Education(newVal);
      $scope.titleSearchText = newVal ? newVal.title : null;
      $scope.schoolSearchText = newVal ? newVal.school : null;
      $scope.educationSearchText = newVal ? newVal.education : null;
      getOptions();
    });

    $scope.saveEducation = function(){
      DataService.saveSkill($scope.education,'education')
        .then(function (data) {
            $state.go('education',{},{reload:true});
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

    $scope.cancel = function(){
      $scope.$parent.toggleRight();
    }

    $scope.createFilterFor = function(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(option) {
        return (option.value.indexOf(lowercaseQuery) > -1);
      };
    }

    $scope.deleteRecord = function(){
      $http(DataRequest.request('DELETE', 'deleterecord?table=education&idrecord=' + $scope.education.ideducation))
        .then(function() {
            $state.go('education',{},{reload:true});
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
      $http(DataService.request('GET','options?table=education&field=title')).
        then(function(response) {
          $scope.titles = response.data.data.map(function(t){
            return {display: t.option, value: t.option.toLowerCase()}
          });
        }, function(response) {

      });
      // Schools
      $http(DataService.request('GET','options?table=education&field=school')).
        then(function(response) {
          $scope.schools = response.data.data.map(function(t){
            return {display: t.option, value: t.option.toLowerCase()}
          });
        }, function(response) {
 
      });

      //Educations
      $http(DataService.request('GET','options?table=education&field=education')).
        then(function(response) {
          $scope.educationValues = response.data.data.map(function(t){
            return {display: t.option, value: t.option.toLowerCase()}
          });
        }, function(response) {
              
      });
    }
    
  }
)

angular.module('knowBase').controller('educationController',
  function ($scope, $state, $http,  DataService, $mdToast, $mdSidenav) {

    $scope.toggleRight = buildToggler('right');
    $scope.siteLabel = 'My Educations';
    function buildToggler(navID) {

      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            
          });
      }
    }

    function getEducations() {
      $scope.educations = [];
      console.log(DataService.request('GET','educations'))
      $http(DataService.request('GET','educations')).
        then(function(response) {
          $scope.status = response.status;
          $.each(response.data.data, function(i,e){
            $scope.educations.push(new DataService.Education(e));
          });
        }, function(response) {
          
      });
    }
    
    $scope.editEducation = function(e){
      $scope.selected = e;
      $scope.toggleRight();
      
    }

    $scope.newEducation = function(){
      $scope.selected = new DataService.Education(null);
      $scope.toggleRight();
    }

    getEducations();
});

angular.module('knowBase').controller('workExperienceFormController',
  function ($scope,$state,$http,DataService,$mdToast){
    $scope.submitText = 'Update work experience';
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

    $scope.$parent.$watch('selected',function(newVal,oldVal){
      $scope.workExperience = new DataService.WorkExperience(newVal);
      $scope.titleSearchText = newVal ? newVal.title : null;
      $scope.employerSearchText = newVal ? newVal.employer : null;
    });

    $scope.saveWorkExperience = function(){
      DataService.saveSkill($scope.workExperience,'workexperience')
        .then(function (data) {
            $state.go('workexperience',{},{reload:true});
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
    
    $scope.cancel = function(){
      $scope.$parent.toggleRight();
    }


    $scope.createFilterFor = function(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(option) {
        return (option.value.indexOf(lowercaseQuery) > -1);
      };
    }

    $scope.deleteRecord = function(){
      $http(DataRequest.request('DELETE', 'deleterecord?table=workExperience&idrecord=' + $scope.workExperience.idworkexperience))
        .then(function() {
            $state.go('workexperience');
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
      $http(DataService.request('GET','options?table=workExperience&field=title')).
        then(function(response) {
          $scope.titles = response.data.data.map(function(t){
            return {display: t.option, value: t.option.toLowerCase()}
          });
          
        }, function(response) {
              
      });
      // Employers
      $http(DataService.request('GET','options?table=workExperience&field=employer')).
        then(function(response) {
          $scope.employers = response.data.data.map(function(t){
            return {display: t.option, value: t.option.toLowerCase()}
          });
        }, function(response) {
              
      });
    }

    getOptions();
  }
);

angular.module('knowBase').controller('workExperienceController',


  function ($scope, $state, $http,  DataService, $mdToast, $mdSidenav) {
    $scope.workExperiences = [];
    $scope.toggleRight = buildToggler('right');
    $scope.siteLabel = 'My Work experience';
    function buildToggler(navID) {

      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            
          });
      }
    }
    
    function getWorkExperiences() {
      $scope.workExperiences = [];
      $http(DataService.request('GET','workexperience'))
        .then(function(response) {
          $scope.status = response.status;
          $.each(response.data.data, function(i,w){
            $scope.workExperiences.push(new DataService.WorkExperience(w));
          });
          
        }, function(response) {

      });
    }
    
    $scope.editWorkExperience = function(w){
      $scope.selected = w;
      $scope.toggleRight();
    }

    $scope.newWorkExperience = function(){
      $scope.selected = new DataService.WorkExperience(null);
      $scope.toggleRight();
    }
    getWorkExperiences();
});

angular.module('knowBase').controller('experienceFormController',
  function ($scope, $state, $http,  DataService, $mdToast) {
    $scope.submitText = 'Upstartdate experience';
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

    $scope.$parent.$watch('selected',function(newVal,oldVal){
      $scope.experience = new DataService.Experience(newVal);
      $scope.nameSearchText = newVal ? newVal.name : null;
      getOptions();
    });

    
    $scope.saveExperience = function(){
      DataService.saveSkill($scope.experience,'experience')
        .then(function (data) {
            $state.go('experience',{},{reload:true});
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
    $scope.cancel = function(){
      $scope.$parent.toggleRight();
    }

    $scope.deleteRecord = function(){
      $http(DataRequest.request('DELETE', 'deleterecord?table=experience&idrecord=' + $scope.experience.idexperience))
        .then(function() {
            $state.go('experience',{},{reload:true});
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
      $http(DataService.request('GET','options?table=experience&field=name')).
        then(function(response) {
          $scope.names = response.data.data.map(function(t){
            return {display: t.option, value: t.option.toLowerCase()}
          });
          
        }, function(response) {
              
      });
    }
});

angular.module('knowBase').controller('experienceController',
  function ($scope, $state, $http,  DataService, $mdToast, $mdSidenav) {
    
    $scope.experiences = [];
    $scope.toggleRight = buildToggler('right');
    $scope.siteLabel = 'My Experience';

    function buildToggler(navID) {

      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            
          });
      }
    }
    
    function getExperiences() {
      $scope.experiences = [];
      $http(DataService.request('GET','experiences')).
        then(function(response) {
          $scope.status = response.status;
          $.each(response.data.data, function(i,e){
            $scope.experiences.push(new DataService.Experience(e));
          });
          
        }, function(response) {

      });
    }
    
    $scope.editExperience = function(e){
      $scope.selected = e;
      $scope.toggleRight();
    }

    $scope.newExperience = function(){
      $scope.selected = new DataService.Experience(null);
      $scope.toggleRight();
    }
    getExperiences();
});



angular.module('knowBase').controller('publicationFormController',
  function ($scope, $state, $http,  DataService, $mdToast) {
    $scope.submitText = 'Update publication';
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

    $scope.$parent.$watch('selected',function(newVal,oldVal){
      $scope.publication = new DataService.Publication(newVal);
      $scope.titleSearchText = newVal ? newVal.title : null;
      getOptions();
    });

    $scope.savePublication = function(){
      DataService.saveSkill($scope.publication,'publication')
        .then(function (data) {
            $state.go('publication',{},{reload:true});
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
    $scope.cancel = function(){
      $scope.$parent.toggleRight();
    }

    $scope.deleteRecord = function(){
      $http(DataRequest.request('DELETE', 'deleterecord?table=publication&idrecord=' + $scope.publication.idpublication))
        .then(function() {
            $state.go('publication',{},{reload:true});
        }, 
        function(response) {
          $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to remove publication!</md-toast>',
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
      $http(DataService.request('GET','options?table=publication&field=title')).
        then(function(response) {
          $scope.titles = response.data.data.map(function(t){
            return {display: t.option, value: t.option.toLowerCase()}
          });
          
        }, function(response) {
              
      });
    }
});



angular.module('knowBase').controller('publicationController',
  function ($scope, $state, $http,  DataService, $mdToast, $mdSidenav) {
    
    $scope.publications = [];
    $scope.toggleRight = buildToggler('right');
    $scope.siteLabel = 'My Publications';

    function buildToggler(navID) {

      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            
          });
      }
    }
    
    function getPublications() {
      $scope.publications = [];
      $http(DataService.request('GET','publications')).
        then(function(response) {
          $scope.status = response.status;
          $.each(response.data.data, function(i,p){
            $scope.publications.push(new DataService.Publication(p));
          });
          
        }, function(response) {

      });
    }
    
    $scope.editPublication = function(p){
      $scope.selected = p;
      $scope.toggleRight();
    }

    $scope.newPublication = function(){
      $scope.selected = new DataService.Publication(null);
      $scope.toggleRight();
    }
    getPublications();
});



angular.module('knowBase').controller('projectFormController',
  function ($scope, $state, $http,  DataService, $mdToast) {
    $scope.submitText = 'Update project';
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

    $scope.$parent.$watch('selected',function(newVal,oldVal){
      $scope.project = new DataService.Project(newVal);
      $scope.nameSearchText = newVal ? newVal.name : null;
      
      $scope.customerSearchText = newVal ? newVal.customername : null;
      getOptions();
    });

    $scope.saveProject = function(){
      DataService.saveSkill($scope.project,'project')
        .then(function (data) {
            $state.go('project',{},{reload:true});
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

    $scope.cancel = function(){
      $scope.$parent.toggleRight();
    }

    $scope.deleteRecord = function(){
      $http(DataRequest.request('DELETE', 'deleterecord?table=workExperience&idrecord=' + $scope.workExperience.idworkexperience))
        .then(function() {
            $state.go('project',{},{reload:true});
        }, 
        function(response) {
          $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to remove project!</md-toast>',
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
      $http(DataService.request('GET','options?table=project&field=name')).
        then(function(response) {
          $scope.names = response.data.data.map(function(t){
            return {display: t.option, value: t.option.toLowerCase()}
          });
        }, function(response) {
              
      });
      // Customers
      $http(DataService.request('GET','customers')).
        then(function(response) {
          $scope.customers = response.data.data.map(function(t){
            return {display: t.name, value: t.name.toLowerCase(), idcustomer : t.idcustomer}
          });
        }, function(response) {
              
      });
    }
});



angular.module('knowBase').controller('projectController',
  function ($scope, $state, $http,  DataService, $mdToast, $mdSidenav) {
    
    $scope.projects = [];
    $scope.toggleRight = buildToggler('right');
    $scope.siteLabel = 'My Projects';

    function buildToggler(navID) {

      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            
          });
      }
    }
    
    function getProjects() {
      $scope.projects = [];
      $http(DataService.request('GET','projects')).
        then(function(response) {
          $scope.status = response.status;
          $.each(response.data.data, function(i,p){
            $scope.projects.push(new DataService.Project(p));
          });
          
        }, function(response) {

      });
    }
    
    $scope.editProject = function(p){
      $scope.selected = p;
      $scope.toggleRight();
    }

    $scope.newProject = function(){
      $scope.selected = new DataService.Project(null);
      $scope.toggleRight();
    }
    getProjects();
});


angular.module('knowBase').controller('meritFormController',
  function ($scope, $state, $http,  DataService, $mdToast) {
    $scope.submitText = 'Update merit';
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

    $scope.$parent.$watch('selected',function(newVal,oldVal){
      $scope.merit = new DataService.Merit(newVal);
      $scope.nameSearchText = newVal ? newVal.name : null;
      getOptions();
    });

    $scope.saveMerit = function(){
      DataService.saveSkill($scope.merit,'merit')
        .then(function (data) {
            $state.go('merit',{},{reload:true});
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
    $scope.cancel = function(){
      $scope.$parent.toggleRight();
    }

    $scope.deleteRecord = function(){
      $http({method: 'DELETE', url: '/api/deleterecord?table=merit&idrecord=' + $scope.merit.idmerit})
        .then(function() {
            $state.go('merit',{},{reload:true});
        }, 
        function(response) {
          $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to remove merit!</md-toast>',
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
      $http(DataService.request('GET','options?table=merit&field=name')).
        then(function(response) {
          $scope.names = response.data.data.map(function(t){
            return {display: t.option, value: t.option.toLowerCase()}
          });
          
        }, function(response) {
              
      });
    }
});



angular.module('knowBase').controller('meritController',
  function ($scope, $state, $http,  DataService, $mdToast, $mdSidenav) {
    
    $scope.merits = [];
    $scope.toggleRight = buildToggler('right');
    $scope.siteLabel = 'My Merits';

    function buildToggler(navID) {

      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            
          });
      }
    }
    
    function getMerits() {
      $scope.merits = [];
      $http(DataService.request('GET','merits')).
        then(function(response) {
          $scope.status = response.status;
          $.each(response.data.data, function(i,p){
            $scope.merits.push(new DataService.Merit(p));
          });
          
        }, function(response) {

      });
    }
    
    $scope.editMerit = function(p){
      $scope.selected = p;
      $scope.toggleRight();
    }

    $scope.newMerit = function(){
      $scope.selected = new DataService.Merit(null);
      $scope.toggleRight();
    }
    getMerits();
});

angular.module('knowBase').controller('languageFormController',
  function ($scope, $state, $http,  DataService, $mdToast, $timeout) {
    $scope.submitText = 'Update language';
    $scope.languageLabel = 'Language';
    $scope.writingLabel = 'Writing proficiency';
    $scope.listeningLabel = 'Listening proficiency';
    $scope.readingLabel = 'Reading proficiency';
    $scope.conversationLabel = 'Conversation proficiency';
    $scope.verbalLabel = 'Verbal proficiency';
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


    $scope.$parent.$watch('selected',function(newVal,oldVal){
      $scope.language = new DataService.Language(newVal);
      $scope.languageSearchText = newVal ? newVal.language : null;
      getOptions();
    });

    $scope.saveLanguage = function(){
      DataService.saveSkill($scope.language,'language')
        .then(function (data) {
            $state.go('language',{},{reload:true});
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
    $scope.cancel = function(){
      $scope.$parent.toggleRight();
    }

    $scope.deleteRecord = function(){
      $http({method: 'DELETE', url: '/api/deleterecord?table=language&idrecord=' + $scope.language.idlanguage})
        .then(function() {
            $state.go('language',{},{reload:true});
        }, 
        function(response) {
          $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to remove language!</md-toast>',
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
      $http(DataService.request('GET','options?table=language&field=language')).
        then(function(response) {
          $scope.languageValues = response.data.data.map(function(t){
            return {display: t.option, value: t.option.toLowerCase()}
          });
  
        }, function(response) {
              
      });
    }

});


angular.module('knowBase').controller('languageController',
  function ($scope, $state, $http,  DataService, $mdToast, $mdSidenav) {
    
    $scope.languages = [];
    $scope.toggleRight = buildToggler('right');
    $scope.siteLabel = 'My Languages';

    function buildToggler(navID) {

      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            
          });
      }
    }
    
    function getLanguages() {
      $scope.languages = [];
      $http(DataService.request('GET','languages')).
        then(function(response) {
          $scope.status = response.status;
          $.each(response.data.data, function(i,l){
            $scope.languages.push(new DataService.Language(l));
          });
          
        }, function(response) {

      });
    }
    
    $scope.editLanguage = function(l){
      $scope.selected = l;
      $scope.toggleRight();
    }

    $scope.newLanguage = function(){
      $scope.selected = new DataService.Language(null);
      $scope.toggleRight();
    }
    getLanguages();
});



angular.module('knowBase').controller('skillFormController',
  function ($scope, $state, $http,  DataService, $mdToast, $timeout) {
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

    
    $scope.$parent.$watch('selected',function(newVal,oldVal){
      $scope.skill = new DataService.Skill(newVal);
      $scope.nameSearchText = newVal ? newVal.name : null;
      getOptions();
    });

    $scope.saveSkill = function(){
      DataService.saveSkill($scope.skill,'skill')
        .then(function (data) {
            $state.go('skill',{},{reload:true});
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
    $scope.cancel = function(){
      $scope.$parent.toggleRight();
    }

    $scope.deleteRecord = function(){
      $http({method: 'DELETE', url: '/api/deleterecord?table=skill&idrecord=' + $scope.skill.idskill})
        .then(function() {
            $state.go('skill',{},{reload:true});
        }, 
        function(response) {
          $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to remove skill!</md-toast>',
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
      $http(DataService.request('GET','options?table=skill&field=name')).
        then(function(response) {
          $scope.names = response.data.data.map(function(t){
            return {display: t.option, value: t.option.toLowerCase()}
          });
          
        }, function(response) {
              
      });
    }

});

angular.module('knowBase').controller('skillController',
  function ($scope, $state, $http,  DataService, $mdToast, $mdSidenav) {
    
    $scope.skills = [];
    $scope.toggleRight = buildToggler('right');
    $scope.siteLabel = 'My Key skills';

    function buildToggler(navID) {

      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            
          });
      }
    }
    
    function getSkills() {
      $scope.skills = [];
      $http(DataService.request('GET','skills')).
        then(function(response) {
          $scope.status = response.status;
          $.each(response.data.data, function(i,s){
            $scope.skills.push(new DataService.Skill(s));
          });
          
        }, function(response) {

      });
    }
    
    $scope.editSkill = function(s){
      $scope.selected = s;
      $scope.toggleRight();
    }

    $scope.newSkill = function(){
      $scope.selected = new DataService.Skill(null);
      $scope.toggleRight();
    }
    getSkills();
});


angular.module('knowBase').controller('skillsController',
  function ($scope, $state, SkillService, DataService) {
    $scope.siteLabel = 'My Competences';
    $scope.activeSkill = '';
    function getSkillTypes() {
        DataService.getSkillTypes()
            .success(function (response) {
                $scope.skillTypes = response.data;
                $scope.tiles = SkillService.buildGridModel($scope,{
                  icon : "",
                  title: "",
                  background: ""
                });

            })
            .error(function (error) {
                
            });
    }
    
    

    // $scope.togglePage = function(){

    //   $('#list-column').toggleClass("hide");
    //   $('#skill-column').toggleClass("hide");

    //   $('.tab-selector').toggleClass("selected");
      
    //   if($('#skill-column').attr('hide')){

    //     $('#skill-column').removeAttr('hide');
    //   }else{
    //     $('#skill-column').attr('hide','true');
    //   }


    // }

    $scope.skillView = function(skill){
      $state.go(skill)
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
  function ($scope, $state, $timeout, DataService, $mdDialog, $mdMedia, $http,  $mdToast) {
    $scope.title = 'Profile';
    $scope.profileTab = 'info';
    $scope.imgsrc = '';
    $scope.siteLabel = 'My ';


    function getProfile() {
      DataService.getProfile()
          .success(function (response) { 
              $scope.profile = new DataService.Profile(response.data);
              $scope.siteLabel = $scope.profile.descriptive_header;
          })
          .error(function (error) {
              $scope.status = 'Unable to load profile data: ' + error.message;
          });
    }


    

    $http(DataService.request('GET','profilepicture'))
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


angular.module('knowBase').controller('competenceProfilesController',
  function ($scope, $state, $http,  DataService, $mdToast, $mdSidenav) {
    $scope.nameLabel = 'Name';
    $scope.querySearch = querySearch;
    $scope.competenceProfiles = [];
    $scope.competenceProfile

    $scope.educations = [];
    $scope.workExperiences = [];
    $scope.publications = [];
    $scope.skills = [];
    $scope.languages = [];
    $scope.merits = [];
    $scope.projects = [];
    $scope.experiences = [];
    $scope.allEducations = [];
    $scope.allWorkExperiences = [];
    $scope.allPublications = [];
    $scope.allSkills = [];
    $scope.allLanguages = [];
    $scope.allMerits = [];
    $scope.allProjects = [];
    $scope.allExperiences = [];

    $scope.filter_skilltypes = true;
    $scope.focused = { skilltype: '' };
    $scope.resetFocus = function(){
      $scope.focused.skilltype = '';
    }

    $scope.filterResults = function(all, selected){
      return all.filter(function(obj){
        return !selected.some(function(obj2){
          return obj.value==obj2.value;
        });
      });
    }

    $scope.toggleRight = buildToggler('right');

    function buildToggler(navID) {

      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            
          });
      }
    }

    function getData() {

      $http(DataService.request('GET','competenceprofiles?idprofile=' + $scope.$parent.profile.idprofile))
      .then(function(response) {
          $scope.status = response.status;
          $.each(response.data.data, function(i,p){
            $scope.competenceProfiles.push(new DataService.CompetenceProfile(p));
          });
        }, function(response) {
          $scope.data = response.data || "Request failed";
          $scope.status = response.status;
      });
      $http(DataService.request('GET','educations')).
        then(function(response) {
          $scope.status = response.status;
          $.each(response.data.data, function(i,e){
            $scope.allEducations.push(new DataService.Education(e));
          });

          
        }, function(response) {
          $scope.data = response.data || "Request failed";
          $scope.status = response.status;
      });
      $http(DataService.request('GET','workexperience')).
        then(function(response) {
          $scope.status = response.status;
          $.each(response.data.data, function(i,w){
            $scope.allWorkExperiences.push(new DataService.WorkExperience(w));
          });
          
        }, function(response) {
          $scope.data = response.data || "Request failed";
          $scope.status = response.status;
      });
      $http(DataService.request('GET','languages')).
        then(function(response) {
          $scope.status = response.status;
          $.each(response.data.data, function(i,l){
            $scope.allLanguages.push(new DataService.Language(l));
          });
          
        }, function(response) {
          $scope.data = response.data || "Request failed";
          $scope.status = response.status;
      });
      $http(DataService.request('GET','skills')).
        then(function(response) {
          $scope.status = response.status;
          $.each(response.data.data, function(i,s){
            $scope.allSkills.push(new DataService.Skill(s));
          });
          
        }, function(response) {
          $scope.data = response.data || "Request failed";
          $scope.status = response.status;
      });
      $http(DataService.request('GET','projects')).
        then(function(response) {
          $scope.status = response.status;
          $.each(response.data.data, function(i,p){
            $scope.allProjects.push(new DataService.Project(p));
          });
          
        }, function(response) {
          $scope.data = response.data || "Request failed";
          $scope.status = response.status;
      });
      $http(DataService.request('GET','experiences')).
        then(function(response) {
          $scope.status = response.status;
          $.each(response.data.data, function(i,e){
            $scope.allExperiences.push(new DataService.Experience(e));
          });
          
        }, function(response) {
          $scope.data = response.data || "Request failed";
          $scope.status = response.status;
      });
      $http(DataService.request('GET','merits')).
        then(function(response) {
          $scope.status = response.status;
          $.each(response.data.data, function(i,m){
            $scope.allMerits.push(new DataService.Merit(m));
          });
          
        }, function(response) {
          $scope.data = response.data || "Request failed";
          $scope.status = response.status;
      });
      $http(DataService.request('GET','publications')).
        then(function(response) {
          $scope.status = response.status;
          $.each(response.data.data, function(i,p){
            $scope.allPublications.push(new DataService.Publication(p));
          });
          
        }, function(response) {
          $scope.data = response.data || "Request failed";
          $scope.status = response.status;
      });


    }
    function querySearch (query, competence) {
      switch(competence){
        case "education":
          var results = query ? $scope.allEducations.filter(createFilterFor(query, competence)) : $scope.allEducations;
          return results;
          break;
        case "workExperience":
          var results = query ? $scope.allWorkExperiences.filter(createFilterFor(query, competence)) : $scope.allWorkExperiences;
          return results;
          break;
        case "skill":
          var results = query ? $scope.allSkills.filter(createFilterFor(query, competence)) : $scope.allSkills;
          return results;
          break;
        case "publication":
          var results = query ? $scope.allPublications.filter(createFilterFor(query, competence)) : $scope.allPublications;
          return results;
          break;
        case "experience":
          var results = query ? $scope.allExperiences.filter(createFilterFor(query, competence)) : $scope.allExperiences;
          return results;
          break;
        case "language":
          var results = query ? $scope.allLanguages.filter(createFilterFor(query, competence)) : $scope.allLanguages;
          return results;
          break;
        case "merit":
          var results = query ? $scope.allMerits.filter(createFilterFor(query, competence)) : $scope.allMerits;
          return results;
          break;
        case "project":
          var results = query ? $scope.allProjects.filter(createFilterFor(query, competence)) : $scope.allProjects;
          return results;
          break;
      }
    }
    $scope.deleteRecord = function(){
      $http({method: 'DELETE', url: '/api/deleterecord?table=competenceprofile&idrecord=' + $scope.competenceProfile.idcompetenceprofile})
        .then(function() {
          $scope.competenceProfiles = $scope.competenceProfiles
           .filter(function (p) {
                    return p.idcompetenceprofile !== $scope.competenceProfile.idcompetenceprofile;
                   });
           $mdToast.show({
                template: '<md-toast class="md-toast-success">Education successfully removed!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
           $scope.focused.skilltype = '';
           $scope.competenceProfile = null;
        }, 
        function(response) {
          $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to remove education!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            }); 
      });
    }

    function createFilterFor(query,competence) {
      var lowercaseQuery = angular.lowercase(query);
      switch(competence){
        case "education":
          return function filterFn(education) {
            return (angular.lowercase(education.title).indexOf(lowercaseQuery) != -1) || 
            (angular.lowercase(education.school).indexOf(lowercaseQuery) != -1) ||
            (angular.lowercase(education.education).indexOf(lowercaseQuery) != -1);
          };
          break;
        case "workExperience":
          
          return function filterFn(workExperience) {
            return (angular.lowercase(workExperience.title).indexOf(lowercaseQuery) != -1) || 
            (angular.lowercase(workExperience.employer).indexOf(lowercaseQuery) != -1);
          };
          break;
        case "experience":
          
          return function filterFn(experience) {
            return (angular.lowercase(experience.name).indexOf(lowercaseQuery) != -1);
          };
          break;
        case "publication":
          
          return function filterFn(publication) {
            return (angular.lowercase(publication.title).indexOf(lowercaseQuery) != -1);
          };
          break;
        case "skill":
          
          return function filterFn(skill) {
            return (angular.lowercase(skill.name).indexOf(lowercaseQuery) != -1);
          };
          break;
        case "merit":
          
          return function filterFn(merit) {
            return (angular.lowercase(merit.name).indexOf(lowercaseQuery) != -1);
          };
          break;
        case "language":
          
          return function filterFn(language) {
            return (angular.lowercase(language.language).indexOf(lowercaseQuery) != -1);
          };
          break;
        case "project":
          
          return function filterFn(project) {
            return (angular.lowercase(project.name).indexOf(lowercaseQuery) != -1);
          };
          break;
      }
    }

    $scope.saveCompetenceProfile = function(){


      DataService.saveSkill($scope.selected,'competenceProfile')
        .then(function (data) {
            $state.go('profile',{},{reload:true});

        },
        // handle error
        function (reason) {
            $scope.errorMessage = reason; 
            $scope.error = true;
            $mdToast.show({
                template: '<md-toast class="md-toast-error">Failed to save competence profile!</md-toast>',
                hideDelay: 3000,
                position: 'bottom left'
            });
            $scope.competenceProfile = null;
            $scope.nameSearchText = null;
            $scope.focused.skilltype = '';
        });
    }

    $scope.cancelCompetenceProfile = function(){
      $scope.nameSearchText = null;
      $scope.focused.skilltype = '';
      $scope.toggleRight();

    }

    $scope.editCompetenceProfile = function(o){
      $scope.selected = new DataService.CompetenceProfile(o);
      $scope.toggleRight();

    }

    $scope.newCompetenceProfile = function(){
      $scope.nameSearchText = null;
      $scope.focused.skilltype = '';
      $scope.selected = new DataService.CompetenceProfile(null);
      $scope.toggleRight();
    }
    
    $scope.$parent.$watch('profile',function(newValue, oldValue){
      console.log($scope.$parent.profile)
      if(newValue){
        getData();
      }
    });
    
});