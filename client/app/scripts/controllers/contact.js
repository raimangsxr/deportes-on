'use strict';

/**
 * @ngdoc function
 * @name deportesOnApp.controller:ContactCtrl
 * @description
 * # ContactCtrl
 * Controller of the deportesOnApp
 */
angular.module('deportesOnApp')
  .controller('ContactCtrl', function ($scope, $http) {
    $scope.sendMessage = function(message){
      $http.post('http://localhost:3000/api/messages', message).then(function(response){
        $scope.thanksName = response.data.name;
      }, function(error){
        console.error(error);
      });
    };
  });
