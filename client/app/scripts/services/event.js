'use strict';

/**
 * @ngdoc function
 * @name deportesOnApp.service:eventProperties
 * @description
 * # eventProperties
 * Service to share info between events view and player
 */

angular.module('deportesOnApp')
  .service('EventProperties', function () {
    var channel = 'No valido';
    var title = 'No valido';

    return {
      getChannel: function () {
        return channel;
      },
      setChannel: function(value) {
        channel = value;
      },
      getTitle: function () {
        return title;
      },
      setTitle: function(value) {
        title = value;
      }
    };
  });
