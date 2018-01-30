angular.module('app')
  .controller('TOTPController', function ($window, $scope, $http) {

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

    function noop() {
    }

    $scope.qrcode = null;
    $scope.secret = null;
    $scope.error = null;
    $scope.disabled = false;

    $scope.getSecret = function () {
      $http.get('/api/totp/register')
        .then(parseNetworkResponse)
        .then((res) => {
          console.log('RES', res);
          $scope.qrcode = res.otpauth_url;
          $scope.secret = res.base32;
        })
        .catch(handleNetworkError)
        .catch(noop)
    };

    $scope.confirmSecret = function () {
      $scope.disabled = true;
      const key = $scope.key;
      console.log("confirm key", key);
      if (!key) return $scope.disabled = false;
      $http.post('/api/totp/validate', {token: key})
        .then(parseNetworkResponse)
        .then((res) => {
          $scope.key = null;
          $scope.disabled = false;
          $scope.message = JSON.stringify(res, null, 2);
          $scope.qrcode = null;
          $scope.secret = null;
        })
        .catch(handleNetworkError)
        .catch(noop)
    };

    // otpauth://totp/SecretKey?secret=GIX...
    console.log("in 2AFController");
  })


  .directive('qrcode', function ($window) {

    const qrcode = $window.QRCode;

    const options = {
      margin: 0,
      color: {
        dark: '#000',
        light: '#fff0'
      },
      errorCorrectionLevel: 'H'
    };

    function draw(element, data) {
      if (!data) return;

      qrcode.toCanvas(element, data, options, (error, canvas) => {
        if (error) console.log('Error', error);
      });
    }

    function link($scope, $element) {
      $scope.$watch('data', (value) => draw($element[0], value));
    }

    return {
      restrict: 'E',
      replace: true,
      scope: {
        data: '='
      },
      link: link,
      template: '<canvas></canvas>'
    };

  });
