angular.module('app')

  .factory('u2f', ($window, $q) => {

    const _u2f = $window.u2f;

    return {
      register: (appId, registerRequests, registeredKeys, opt_timeoutSeconds) => new $q((resolve, reject) => {
        _u2f.register(appId, registerRequests, registeredKeys, (deviceResponse) => {

          if (deviceResponse.errorCode)
            reject(deviceResponse);
          else
            resolve(deviceResponse);

        }, opt_timeoutSeconds)
      }),
      sign: (appId, challenge, registeredKeys, callback, opt_timeoutSeconds) => new $q((resolve, reject) => {
        _u2f.sign(appId, challenge, registeredKeys, (deviceResponse) => {

          if (deviceResponse.errorCode)
            reject(deviceResponse);
          else
            resolve(deviceResponse);

        }, opt_timeoutSeconds)
      })
    }

  })

  .controller('U2FController', function (u2f, $scope, $http) {

    const U2F_ERROR_CODES = {
      1: 'OTHER_ERROR',
      2: 'BAD_REQUEST',
      3: 'CONFIGURATION_UNSUPPORTED',
      4: 'DEVICE_INELIGIBLE',
      5: 'TIMEOUT'
    };

    $scope.name = 'U2FController';
    $scope.message = 'Register your key';

    $scope.email = null;
    $scope.pass = null;
    $scope.error = false;

    function parseNetworkResponse(res) {
      console.warn(res);
      $scope.error = false;
      return res.data;
    }

    function handleNetworkError(err) {
      if (!err) throw null;
      console.warn(err);
      $scope.message = err.status + ': ' + err.data.error;
      $scope.error = true;
      throw null;
    }

    function handleU2FError(err) {
      if (!err) throw null;
      console.warn(err);
      $scope.message = "U2F failed with error: " + U2F_ERROR_CODES[err.errorCode];
      $scope.error = true;
    }

    function noop() {}

    $scope.register_key = function () {
      $scope.message = "Press your key";
      $http.get('/api/u2f/register')
        .then(parseNetworkResponse)
        .catch(handleNetworkError)
        .then((regRequest) => {
          console.log('res', regRequest);
          return u2f.register(regRequest.appId, [regRequest], [])
        })
        .catch(handleU2FError)
        .then((deviceResponse) => {
          console.log('DATA', deviceResponse);
          $scope.error = false;

          return $http.post("/api/u2f/register", deviceResponse)
        })
        .then(parseNetworkResponse)
        .then(() => {
          $scope.message = "Successfully registered key.";
        })
        .catch(handleNetworkError)
        .catch(noop)
    };

    $scope.authenticate = function () {
      $http.get("/api/u2f/authenticate")
        .then(parseNetworkResponse)
        .catch(handleNetworkError)
        .then((authRequest) => {
          console.log(authRequest);
          $scope.message = "Press your key";
          return u2f.sign(authRequest.appId, authRequest.challenge, [authRequest])
        })
        .catch(handleU2FError)
        .then((res) => {
          console.log('DATA', res);
          $scope.error = false;
          return $http.post("/api/u2f/authenticate", res)
        })
        .then(parseNetworkResponse)
        .then((res) => {
          $scope.message = JSON.stringify(res, null, 2);
        })
        .catch(handleNetworkError)
        .catch(noop)
    };

    console.log("in U2FController");
  });
