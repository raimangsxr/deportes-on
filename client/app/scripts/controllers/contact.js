'use strict';

/**
 * @ngdoc function
 * @name deportesOnApp.controller:ContactCtrl
 * @description
 * # ContactCtrl
 * Controller of the deportesOnApp
 */
angular.module('deportesOnApp')
  .controller('ContactCtrl', function ($rootScope, $scope, $http) {
    $scope.sendMessage = function(message){
      $http.post($rootScope.config.protocol+'://'+$rootScope.config.host+':'+$rootScope.config.port+'/api/messages', message).then(function(response){
        $scope.thanksName = response.data.name;
      }, function(error){
        console.error(error);
      });
    };
  });
