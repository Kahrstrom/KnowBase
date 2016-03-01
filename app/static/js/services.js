angular.module('knowBase').service('DataService', ['$q', '$timeout','$http', function ($q,$timeout,$http) {
    var dataservice = this;
    dataservice.urlBase = '/api/';

    dataservice.getProfile = function () {
      return $http.get(dataservice.urlBase + 'profile');
    };

    dataservice.getEducations = function () {
  
      return $http.get(dataservice.urlBase + 'educations');
    };

    dataservice.updateProfile = function(profile){
      console.log(profile)
      var deferred = $q.defer();
      $http.post(dataservice.urlBase + 'profile', profile)
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

    dataservice.saveSkill = function(json,type){
      var deferred = $q.defer();
      console.log(json)
      $http.post(dataservice.urlBase + type, json)
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


    dataservice.uploadPicture = function(img){
      var deferred = $q.defer();
      console.log(img)
      $http.post(dataservice.urlBase + 'profilepicture', img)
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

    dataservice.Profile = function(p){
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

    dataservice.CompetenceProfile = function(p){
      var self = this;
      self.idcompetenceprofile = p ? p.idcompetenceprofile : null;
      self.name = p ? p.name : '';
      self.workExperiences = p ? p.workexperiences : [];
      self.educations = p ? p.educations : [];
      self.publications = p ? p.publications : [];
      self.skills = p ? p.skills : [];
      self.experiences = p ? p.experiences : [];
      self.projects = p ? p.projects : [];
      self.merits = p ? p.merits : [];
      self.languages = p ? p.languages : [];
    }

    dataservice.Education = function(e){
      var self = this;
      self.ideducation = e ? e.ideducation : null;
      self.title = e ? e.title : '';
      self.education = e ? e.education : '';
      self.school = e ? e.school : '';
      self.startdate = e ? (e.startdate ? new Date(e.startdate) : null) : null;
      self.enddate = e ? (e.enddate ? new Date(e.enddate) : null) : null;
      self.description = e ? e.description : '';
      self.image = '../static/resources/icons/png/ic_school_black_24dp_1x.png';
    }

    dataservice.WorkExperience = function(w){
      var self = this;
      self.idworkexperience = w ? w.idworkexperience : null;
      self.title = w ? w.title : '';
      self.employer = w ? w.employer : '';
      self.startdate = w ? (w.startdate ? new Date(w.startdate) : null) : null;
      self.enddate = w ? (w.enddate ? new Date(w.enddate) : null) : null;
      self.description = w ? w.description : '';
    }

    dataservice.Publication = function(e){
      var self = this;
      self.idpublication = e ? e.idpublication : null;
      self.authors = e ? e.authors : '';
      self.title = e ? e.title : '';
      self.date = e ? (e.date ? new Date(e.date) : null) : null;
      self.description = e ? e.description : '';
      self.publication = e ? e.publication : '';
    }

    dataservice.Language = function(o){
      var self = this;
      self.idlanguage = o ? o.idlanguage : null;
      self.language = o ? o.language : '';
      self.writing = o ? o.writing : '';
      self.listening = o ? o.listening : '';
      self.reading = o ? o.reading : '';
      self.conversation = o ? o.conversation : '';
      self.verbal = o ? o.verbal : '';
    }
   
    dataservice.Skill = function(o){
      var self = this;
      self.idskill = o ? o.idskill : null;
      self.name = o ? o.name : '';
      self.level = o ? o.level : null;
      self.description = o ? o.description : '';
    }

    dataservice.Merit = function(m){
      var self = this;
      self.idmerit = m ? m.idmerit : null;
      self.name = m ? m.name : '';
      self.date = m ? (m.date ? new Date(m.date) : null) : null;
      self.description = m ? m.description : '';
    }

    dataservice.Experience = function(o){
      var self = this;
      self.idexperience = o ? o.idexperience : null;
      self.name = o ? o.name : '';
      self.startdate = o ? (o.startdate ? new Date(o.startdate) : null) : null;
      self.enddate = o ? (o.enddate ? new Date(o.enddate) : null) : null;
      self.description = o ? o.description : '';
    }

    dataservice.Project = function(o){
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

