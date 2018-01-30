angular.module('app', ['ui.router'])

  .factory('userStore', () => {
    let u = null;
    return {
      set: (user) => u = user,
      get: () => u
    }
  })

  .controller('MainController', function ($scope, $http, userStore) {
    console.log('in MainController');
    $scope.user = userStore.get();

    $scope.$watch(() => userStore.get(), (user) => {
      $scope.user = user;
    }, true);

    $http.get('/api/user')
      .then((res) => res.data)
      .then(({user}) => {
        console.log('user', user);
        userStore.set(user);
      })
      .catch((err) => {
        console.error(err);
      })

  })

  .config(($stateProvider, $locationProvider, $urlRouterProvider) => {

    const logged = ['$q', '$state', '$http', ($q, $state, $http) => {

      const redirect = () => $state.go('root');

      return $http.get('/api/user')
        .then((res) => {
          if (!res.data.user)
            return redirect();
        })
        .catch(redirect);
    }];

    $urlRouterProvider.otherwise("/");

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: true
    });

    $stateProvider
      .onInvalid((err) => {
        console.log('invalid', err);
      });

    $stateProvider
      .state('u2f', {
        url: '/u2f',
        templateUrl: '/pages/u2f.html',
        controller: 'U2FController',
        resolve: {logged}
      })
      .state('totp', {
        url: '/totp',
        templateUrl: '/pages/totp.html',
        controller: 'TOTPController',
        resolve: {logged}
      })
      .state('root', {
        url: '/',
        templateUrl: '/pages/login.html',
        controller: 'LoginController'
      })
    ;
  })

  .directive('apiError', () => ({
    template: "<strong>Error ({{apiError.status}}):</strong>" +
    "<br />status: {{apiError.data.status}} " +
    "<br />message: {{apiError.data.error}}" +
    "<br />code: {{apiError.data.code}}"
  }));
