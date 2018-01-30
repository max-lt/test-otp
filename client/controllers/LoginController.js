angular.module('app')
  .controller('LoginController', function ($scope, $http, userStore) {
    $scope.name = 'LoginController';

    $scope.logged = userStore.get;
    $scope.user = null;
    $scope.pass = null;
    $scope.debug = {};

    function clearErr(data) {
      $scope.debug = null;
      return data;
    }

    function showErr(err) {
      console.warn(err);
      $scope.debug = {};
      $scope.debug.err = {message: err.statusText, code: err.status};
      $scope.debug.res = err.data;
    }

    $scope.login = function () {
      var login = $scope.user, password = $scope.pass;
      if (!login || !password) return false;
      $http.post('/api/user/login', {login, password})
        .then(clearErr)
        .then(({data}) => {
          userStore.set(data.user)
        })
        .catch(showErr);
    };

    $scope.register = function () {
      var login = $scope.user, password = $scope.pass;
      //if (!user || !pass) return false;
      $http.post('/api/user/register', {login, password})
        .then(clearErr)
        .then(({data}) => {
          userStore.set(data.user);
        })
        .catch(showErr);
    };

    $scope.logout = () => {
      $http.get('/api/user/logout')
        .then(() => {
          $scope.user = '';
          $scope.pass = '';
          userStore.set(null)
        })
        .then(clearErr)
        .catch(showErr)
    };

    console.log("in LoginController");
  })
;
