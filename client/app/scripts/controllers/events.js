'use strict';

/**
 * @ngdoc function
 * @name deportesOnApp.controller:EventsCtrl
 * @description
 * # EventsCtrl
 * Controller of the deportesOnApp
 */
angular.module('deportesOnApp')
  .controller('EventsCtrl', function ($rootScope, $scope, $http, $location, $window, NgTableParams, EventProperties) {

    $http.get($rootScope.config.protocol+'://'+$rootScope.config.host+':'+$rootScope.config.port+'/api/events').then(
      function(response){ //sucess
        delete $scope.error;
        $scope.events = new NgTableParams(
          { //initial Params
            count: 10 // initial page size
          },
          {
            //counts: [],
            paginationMaxBlocks: 10,
            paginationMinBlocks: 3,
            data: response.data
          }
        );
      },
      function(err){ //error
        console.log(err.statusCode+': Error getting events: '+err.message);
        $scope.error = "Error recuperando eventos desde el servidor";
    });

    $scope.playChannel = function(title, channel) {
      EventProperties.setTitle(title);
      EventProperties.setChannel(channel);
      $location.path('/player');
    };

    $scope.openAppChannel = function(stream){
      $http.get($rootScope.config.protocol+'://'+$rootScope.config.host+':'+$rootScope.config.port+'/api/streams/'+stream).then(
        function(response){ //sucess
          delete $scope.error;
          $window.location.href = response.data.link;
        },
        function(err){ //error
          console.log(err.statusCode+': Error getting events: '+err.message);
          $scope.error = 'Error recuperando el canal '+stream+' desde el servidor';
      });
    }
  });
