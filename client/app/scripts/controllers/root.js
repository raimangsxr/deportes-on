'use strict';

/**
 * @ngdoc function
 * @name deportesOnApp.controller:RootCtrl
 * @description
 * # RootCtrl
 * Root Controller of the deportesOnApp
 */
angular.module('deportesOnApp')
  .controller('RootCtrl', function ($rootScope) {
    $rootScope.config = {
      protocol: 'http',
      //host: 'endirecto.chickenkiller.com',
      host: 'localhost',
      //port: 80
      port: 3000
    }
    $rootScope.setNavActive = function(idNewActive){
      var navOldActive = angular.element(document.querySelector('.active'));
      navOldActive.removeClass('active');
      var navNewActive = angular.element(document.querySelector('#'+idNewActive));
      navNewActive.addClass('active');
    }
  });


