angular.module('knowBase').service('DataService', ['$q', '$timeout','$http','$cookies', function ($q,$timeout,$http, $cookies) {
    var dataservice = this;
    dataservice.host = 'http://213.112.209.12:8080';
    dataservice.urlBase = dataservice.host + '/api/';

    dataservice.getProfile = function (idprofile) {
      var args = idprofile ? "?idprofile=" + idprofile : "";
      return $http({method: 'GET', url : dataservice.urlBase + 'profile' + args, headers : {Authorization : 'Basic ' + btoa($cookies.get('token') + ':youwish!')}});
    };

    dataservice.getCompetenceProfiles = function (idprofile) {
      var args = idprofile ? "?idprofile=" + idprofile : "";
      return $http({method: 'GET', url : dataservice.urlBase + 'competenceprofiles' + args, headers : {Authorization : 'Basic ' + btoa($cookies.get('token') + ':youwish!')}});
    };

    dataservice.getSkillTypes = function(){
      return $http(dataservice.request('GET','skilltypes'));
    }

    dataservice.request = function(method, url){
      return {
        method : method,
        url : dataservice.urlBase + url,
        headers : {Authorization : 'Basic ' + btoa($cookies.get('token')+':youwish!')}
      };
    }

    dataservice.getResourceRequests = function(){
      return $http(dataservice.request('GET','resourcerequest'));
    }

    // dataservice.getSkills = function () {
    //   return $http(dataservice.request('GET','educations'));
    // };

    dataservice.searchData = function(query){
      var deferred = $q.defer();
      $http({method : 'POST', url : dataservice.urlBase + 'search', data: query, headers : {Authorization : 'Basic ' + btoa($cookies.get('token') + ':sdfsdf')}})
        .success(function (data, status) {
          if(status === 200){
            deferred.resolve(data);
            data = null;
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

    dataservice.updateProfile = function(profile){
      var deferred = $q.defer();
      $http({method: 'POST', url : dataservice.urlBase + 'profile', data : profile, headers : {Authorization : 'Basic ' + btoa($cookies.get('token') + ':sdfsdf')}})
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
      $http({method: 'POST', url: dataservice.urlBase + type, data : json, headers : {Authorization : 'Basic ' + btoa($cookies.get('token') + ':sdfsdf')}})
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
      $http.post({method: 'POST', url: dataservice.urlBase + 'profilepicture', data : img, headers : {Authorization : 'Basic ' + btoa($cookies.get('token') + ':youwish!')}})
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
      self.position = p.position;
      self.email = p.email;
      self.description = p.description;
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
      self.descriptive_header = p ? p.descriptive_header : '';
      self.descriptive_subheader = p ? p.descriptive_subheader : '';
    }

    dataservice.ResourceRequest = function(r){
      var self = this;
      self.idresourcerequest = r ? r.idresourcerequest : null;
      self.title = r ? r.title : '';
      self.contactemail = r ? r.contactemail : '';
      self.contactname = r ? r.contactname : '';
      self.startdate = r ? (r.startdate ? new Date(r.startdate) : null) : null;
      self.enddate = r ? (r.enddate ? new Date(r.enddate) : null) : null;
      self.externallink = r ? r.externallink : '';
      self.description = r ? r.description : '';
      self.descriptive_header = r ? r.descriptive_header : '';
      self.descriptive_subheader = r ? r.descriptive_subheader : '';
      console.log(self.descriptive_header)
      console.log(self.descriptive_subheader)
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
      self.descriptive_header = e ? e.descriptive_header : '';
      self.descriptive_subheader = e ? e.descriptive_subheader : '';
    }

    dataservice.WorkExperience = function(w){
      var self = this;
      self.idworkexperience = w ? w.idworkexperience : null;
      self.title = w ? w.title : '';
      self.employer = w ? w.employer : '';
      self.startdate = w ? (w.startdate ? new Date(w.startdate) : null) : null;
      self.enddate = w ? (w.enddate ? new Date(w.enddate) : null) : null;
      self.description = w ? w.description : '';
      self.descriptive_header = w ? w.descriptive_header : '';
      self.descriptive_subheader = w ? w.descriptive_subheader : '';
    }

    dataservice.Publication = function(e){
      var self = this;
      self.idpublication = e ? e.idpublication : null;
      self.authors = e ? e.authors : '';
      self.title = e ? e.title : '';
      self.date = e ? (e.date ? new Date(e.date) : null) : null;
      self.description = e ? e.description : '';
      self.publication = e ? e.publication : '';
      self.descriptive_header = e ? e.descriptive_header : '';
      self.descriptive_subheader = e ? e.descriptive_subheader : '';
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
      self.descriptive_header = o ? o.descriptive_header : '';
      self.descriptive_subheader = o ? o.descriptive_subheader : '';
    }
   
    dataservice.Skill = function(o){
      var self = this;
      self.idskill = o ? o.idskill : null;
      self.name = o ? o.name : '';
      self.level = o ? o.level : null;
      self.description = o ? o.description : '';
      self.descriptive_header = o ? o.descriptive_header : '';
      self.descriptive_subheader = o ? o.descriptive_subheader : '';
    }

    dataservice.Merit = function(m){
      var self = this;
      self.idmerit = m ? m.idmerit : null;
      self.name = m ? m.name : '';
      self.date = m ? (m.date ? new Date(m.date) : null) : null;
      self.description = m ? m.description : '';
      self.descriptive_header = m ? m.descriptive_header : '';
      self.descriptive_subheader = m ? m.descriptive_subheader : '';
    }

    dataservice.Experience = function(o){
      var self = this;
      self.idexperience = o ? o.idexperience : null;
      self.name = o ? o.name : '';
      self.startdate = o ? (o.startdate ? new Date(o.startdate) : null) : null;
      self.enddate = o ? (o.enddate ? new Date(o.enddate) : null) : null;
      self.description = o ? o.description : '';
      self.descriptive_header = o ? o.descriptive_header : '';
      self.descriptive_subheader = o ? o.descriptive_subheader : '';
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
      self.descriptive_header = o ? o.descriptive_header : '';
      self.descriptive_subheader = o ? o.descriptive_subheader : '';
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


angular.module('knowBase').service('SkillService', ['$q', '$timeout','$http','$cookies', 
  function ($q,$timeout,$http, $cookies) {
    var self = this;
    self.host = 'http://213.112.209.12:8080';
    self.urlBase = self.host + '/api/';

    self.buildGridModel = function($scope, tileTmpl){
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
            it.icon  = it.icon + "school";
            it.span.row = 2;
            break;
          case "workexperience": 
            it.background = "hue-3";  
            it.icon  = it.icon + "work";   
            it.span.row = 2;    
            break;
          case "experience": 
            it.icon  = it.icon + "star";
            it.background = "hue-1";      
            break;
          case "project":
            it.icon  = it.icon + "list";
            it.background = "hue-3";
            it.span.col = 2;
            break;
          case "language":
            it.background = "hue-2";
            it.icon  = it.icon + "forum";
            break;
          case "publication": 
            it.background = "hue-2";
            it.icon  = it.icon + "book";         
            break;
          case "skill": 
            it.background = "hue-1";      
            it.icon  = it.icon + "vpn_key";
            it.span.col = 2;
            break;
          case "merit":
            it.background= "hue-3";
            it.icon = it.icon + "local_activity"
            break;
          }
        results.push(it); 
      });
      return results;
    }
   
}]);


angular.module('knowBase').factory('AuthService',
  ['$q', '$timeout', '$http', '$cookies',
  function ($q, $timeout, $http, $cookies) {
    var self = this;

    self.server = 'http://213.112.209.12:8080';
    self.urlBase = self.server + '/api';
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
    console.log(btoa({email: request.email, password: request.password}))
    $http.post(self.urlBase + '/login', {email: request.email, password: request.password})
      // handle success
      .success(function (data, status) {

        if(status === 200 && data.response){
          expired.setDate(today.getDate() + 1);
          $http({method: 'GET', url: self.urlBase + '/token', headers: {'Authorization' : 'Basic ' +  btoa(request.email + ':' + request.password)}})
          .success(function(data, status){
            $cookies.put('token', data.token, {expires:expired});
            console.log(expired)
            console.log($cookies.get('token'));
          })
          .error(function(t){
            console.log(t)
          });
          user = true;
          
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
        console.log(data)
      });
    console.log("wtf");
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

