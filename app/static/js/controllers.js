angular.module('knowBase').controller('loginController',
  ['$scope', '$state', 'AuthService',
  function ($scope, $state, AuthService) {

    $scope.authed = AuthService.isLoggedIn();
    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;
      // call login from service
      AuthService.login($scope.loginForm.email, $scope.loginForm.password)
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

    // $scope.logout = function () {

      console.log(AuthService.isLoggedIn());

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

      if($scope.signupForm.password !== $scope.signupForm.passwordConfirm){
        $scope.error = true;
        $scope.errorMessage = "The passwords don't correspond!";
        $scope.disabled = false;
        $scope.signupForm.password = "";
        $scope.signupForm.passwordConfirm = "";
        return false;
         
      }
      // call register from service
      AuthService.signup($scope.signupForm.email, $scope.signupForm.password, $scope.signupForm.passwordConfirm)
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
  ['$scope', '$state',
  function ($scope, $state) {
    $scope.welcome = 'Welcome to KnowBase';
}]);

angular.module('knowBase').controller('topbarController',
  ['$scope', '$state','$cookies',
  function ($scope, $state, $cookies) {

    if($cookies.get('expanded') == 'true'){
      $('.topbar').toggleClass('expanded');
      $('.content').toggleClass('expanded');
      $('.sidebar').toggleClass('expanded'); 
      $('.sidebar-header').toggleClass('expanded');
      $('.sidebar-collapsible').toggleClass('expanded');
    }

    $scope.toggleExpand = function(){
      $('.topbar').toggleClass('expanded');
      $('.content').toggleClass('expanded');
      $('.sidebar').toggleClass('expanded'); 
      $('.sidebar-header').toggleClass('expanded');
      $('.sidebar-collapsible').toggleClass('expanded');
      $cookies.put('expanded', $('.sidebar').hasClass('expanded'));
    }
}]);

angular.module('knowBase').controller('navController',
  ['$scope', '$state',
  function ($scope, $state) {
    
}]);


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
                console.log(error.message)
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

angular.module('knowBase').controller('skillsController',
  ['$scope', '$state',
  function ($scope, $state) {
    $scope.title = 'Contact us';
    $scope.skills = [
      {
        name : 'education',
        title : 'Educations',
        icon : 'fa fa-graduation-cap',
        showText: false
      },
      {
        name : 'workexperience',
        title : 'Work',
        icon : 'fa fa-briefcase',
        showText: false
      },
      {
        name : 'language',
        title : 'Languages',
        icon: 'fa fa-comment',
        showText: false
      },
      {
        name : 'projects',
        title : 'Projects',
        icon: 'fa fa-star',
        showText: false
      }
    ]

    $scope.icon = true;
    
    $scope.hoverIn = function(i){
      $scope.skills[i].showText = true;
    }
    $scope.hoverOut = function(i){
      $scope.skills[i].showText = false;
    }
}]);

angular.module('knowBase').controller('profileController',
  ['$scope', '$state', 'DataService',
  function ($scope, $state, DataService) {
    $scope.title = 'Profile';
    $scope.firstnameLabel = 'First name';
    $scope.lastnameLabel = 'Last name';
    $scope.profileForm = {};

    getProfile();


    function getProfile() {
      DataService.getProfile()
          .success(function (response) {
              $scope.profileForm = response.data;
              console.log($scope.profileForm)
          })
          .error(function (error) {
              $scope.status = 'Unable to load profile data: ' + error.message;
              console.log(error.message)
          });
    }

    $scope.updateProfile = function(){
      DataService.updateProfile($scope.profileForm)
        .then(function () {
          console.log('success... Vad göra här?')
        },
        // handle error
        function () {
          console.log('error')
        });
    }
}]);