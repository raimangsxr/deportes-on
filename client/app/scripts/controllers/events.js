'use strict';

/**
 * @ngdoc function
 * @name deportesOnApp.controller:EventsCtrl
 * @description
 * # EventsCtrl
 * Controller of the deportesOnApp
 */
angular.module('deportesOnApp')
  .controller('EventsCtrl', function ($scope, $http, $location, NgTableParams, EventProperties) {

    $http.get('http://localhost:3000/api/events').then(
      function(response){ //sucess
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
    })

    $scope.playChannel = function(title, channel) {
      EventProperties.setTitle(title);
      EventProperties.setChannel(channel);
      $location.path('/player');
    };

  });
