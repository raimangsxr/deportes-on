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
      function(response){ //success
        delete $scope.error;
        angular.element(document.querySelector('#loader')).hide();

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
        angular.element(document.querySelector('#loader')).hide();
    });

    $http.get('http://127.0.0.1:8621').then(
      function(response){ //success
        $scope.aceEngineOk = true;
      },
      function(error){
        $scope.aceEngineOk = false;
      }
    );

    $scope.playChannel = function(title, channel) {
      EventProperties.setTitle(title);
      EventProperties.setChannel(channel);
      $location.path('/player');
    };

    $scope.openAppChannel = function(link){
      $window.location.href = link;
    }


  });
