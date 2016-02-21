angular.module('knowBase').service('DataService', ['$q', '$timeout','$http', function ($q,$timeout,$http) {
    var self = this;
    self.urlBase = '/api/';

    self.getProfile = function () {
      return $http.get(self.urlBase + 'profile');
    };

    self.getEducations = function () {
  
      return $http.get(self.urlBase + 'educations');
    };

    self.updateProfile = function(profile){
      console.log(profile)
      var deferred = $q.defer();
      $http.post(self.urlBase + 'profile', profile)
        .success(function (data, status) {
          if(status === 200){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });
      return deferred.promise;
    }

    self.saveSkill = function(json,type){
      var deferred = $q.defer();
      console.log(json)
      $http.post(self.urlBase + type, json)
        .success(function (data, status) {
          
          if(status === 200){
            deferred.resolve(data);
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });
      return deferred.promise;
    }


    self.uploadPicture = function(img){
      var deferred = $q.defer();
      console.log(img)
      $http.post(self.urlBase + 'profilepicture', img)
        .success(function(data,status){
          if(status === 200 && data.response){
            deferred.resolve();
          }else{
            deferred.reject();
          }
        })
        .error(function(data){
          deferred.reject();
        });
      return deferred.promise;
    }
   
}]);


angular.module('knowBase').service('LocaleService', ['$q', '$timeout','$http', '$window', function ($q,$timeout,$http, $window) {
    var self = this;

    self.setLocale = function(lang){
      console.log(lang)
      var deferred = $q.defer();
      $http.post('/api/setLocale', {locale: lang})
        .success(function (data, status) {
          if(status === 200 && data.response){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data,status) {

          deferred.reject();
        });
      return deferred.promise;
    }
   
}]);


angular.module('knowBase').service('SkillService', ['$q', '$timeout','$http', 
  function ($q,$timeout,$http) {
    var self = this;

    self.getSkillTypes = function(){
      return $http.get('/api/skilltypes')
    }
   
}]);


angular.module('knowBase').factory('AuthService',
  ['$q', '$timeout', '$http', '$cookies',
  function ($q, $timeout, $http, $cookies) {

    // create user variable
    var user = null;

    // return available functions for use in controllers
    return ({
      isLoggedIn: isLoggedIn,
      login: login,
      logout: logout,
      signup: signup
    });

  function isLoggedIn() {
    if(user) {
      return true;
    } else {
      return false;
    }
  }

  function login(request) {

    // create a new instance of deferred
    var deferred = $q.defer();
    var today = new Date();
    var expired = new Date(today);
    console.log( {email: request.email, password: request.password})
    // send a post request to the server
    $http.post('/api/login', {email: request.email, password: request.password})
      // handle success
      .success(function (data, status) {
        
        if(status === 200 && data.response){
          user = true;
          expired.setDate(today.getDate() + 1);
          $cookies.put('user', user, {expires : expired});
          deferred.resolve();
        } else {
          user = false;
          deferred.reject();
        }
      })
      // handle error
      .error(function (data) {
        user = false;
        deferred.reject();
      });

    // return promise object
    return deferred.promise;

  }

  function logout() {

    // create a new instance of deferred
    var deferred = $q.defer();

    // send a get request to the server
    $http.get('/api/logout')
      // handle success
      .success(function (data) {
        user = false;
        deferred.resolve();
        $cookies.remove('user');
      })
      // handle error
      .error(function (data) {
        user = false;
        deferred.reject();
        $cookies.remove('user');
      });

    // return promise object
    return deferred.promise;

  }

  function signup(request) {

    // create a new instance of deferred
    var deferred = $q.defer();
    console.log({email: request.email, firstname: request.firstname, lastname: request.lastname, password: request.password})
    // send a post request to the server
    $http.post('/api/signup', {email: request.email, firstname: request.firstname, lastname: request.lastname, password: request.password})
      // handle success
      .success(function (data, status) {
        if(status === 200 && data.response){
          deferred.resolve();
        } else {
          deferred.reject();
        }
      })
      // handle error
      .error(function (data) {
        deferred.reject();
      });

    // return promise object
    return deferred.promise;

  }

}]);

