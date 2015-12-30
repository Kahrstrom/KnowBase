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
          console.log("error")
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

  function ($scope, $state, $mdDialog, LocaleService) {
    $scope.showSearch = false;

    $scope.toggleSearch = function(){
      $scope.showSearch = !$scope.showSearch;
    }
    LocaleService.setLocale()
    .then(function () {
      console.log("success!")
    },
    // handle error
    function () {
      console.log("error")
    });

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
                console.log($scope.data)
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

angular.module('knowBase').controller('educationController',
  function ($scope, $state, $http, $templateCache) {
    function getEducations() {
     $http({method: 'GET', url: '/api/educations', cache: $templateCache}).
        then(function(response) {
          $scope.status = response.status;
          $scope.educations = response.data.data;
          formatEducationData($scope.educations);
          $scope.title = 'List of your educations';
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

    function formatEducationData(educations){

      $.each(educations,function(i,e){
        e.startdate = new Date(e.startdate);
        e.enddate = new Date(e.enddate);
      });
    }
    getEducations();
});

angular.module('knowBase').controller('skillsController',
  ['$scope', '$state', 'SkillService',
  function ($scope, $state, SkillService) {
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
                console.log(error.message)
            });
    }
    
    function buildGridModel(tileTmpl){
      var it, results = [ ];

      $.each($scope.skillTypes,function(i,s){
        it = angular.extend({},tileTmpl);
        
        it.title = s.locale;
        it.span  = { row : 1, col : 1 };
        it.name = s.name;
        switch(s.name){
          case "education":
            it.background = "hue-3";
            it.icon  = it.icon + "graduation-cap";
            it.span.row = 2;
            break;
          case "workexperience": 
            it.background = "hue-2";  
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
            it.span.col = it.span.row = 2;
            break;
          case "language":
            it.background = "accent";
            it.icon  = it.icon + "comment-o";
            break;
          case "publication": 
            it.background = "hue-2";
            it.icon  = it.icon + "book";         
            break;
          case "skill": 
            it.background = "accent";      
            it.icon  = it.icon + "star";
            break;
          }
        results.push(it); 
      });
      return results;
    }
    getSkillTypes();


}]);


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
  function ($scope, $state, $timeout, DataService, $mdDialog, $mdMedia, $http, $templateCache) {
    $scope.title = 'Profile';
    $scope.profileTab = 'info';
    $scope.imgsrc = '';
    function getProfile() {
      DataService.getProfile()
          .success(function (response) { 
              $scope.profileForm = response.data;

              console.log($scope.profileForm)

          })
          .error(function (error) {
              $scope.status = 'Unable to load profile data: ' + error.message;
          });
    }

    $http({method: 'GET', url: '/api/profilepicture', cache: $templateCache})
    .then(function(response) {

        $scope.status = response.status;
        var response = response.data;
        var data = response.data;
        var extension = response.extension;
        $scope.imgsrc = 'data:image/' + extension + ';base64,' + data;
        $('#profilepicture').attr('src',$scope.imgsrc);
      }, function(response) {
        $scope.img = response.data || "Request failed";
        $scope.status = response.status;

    });
  

    $scope.updateProfile = function(){
      DataService.updateProfile($scope.profileForm)
        .then(function () {
            $scope.success = true;
            $timeout(function () { $scope.success = false; }, 4000);   
        },
        // handle error
        function (reason) {
            $scope.errorMessage = reason; 
            $scope.error = true;
            $timeout(function () { $scope.error = false; }, 4000);   
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
