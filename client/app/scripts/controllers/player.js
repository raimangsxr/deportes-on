'use strict';

/**
 * @ngdoc function
 * @name deportesOnApp.controller:PlayerCtrl
 * @description
 * # PlayerCtrl
 * Controller of the deportesOnApp
 */
angular.module('deportesOnApp')
  .controller('PlayerCtrl', function ($scope, $http, EventProperties) {
    $scope.channel = EventProperties.getChannel();
    $scope.title = EventProperties.getTitle();
    $http.get('http://localhost:3000/api/streams/'+$scope.channel).then(
      function(response){ //sucess
        var stream = response.data;
        var contentId = stream.linkId;

        var useInternalControls = true;
        var controls = new TorrentStream.Controls("tsplayer", {
          style: useInternalControls ? "internal" : "ts-black",
          debug: true
        });
        try {
          var player = new TorrentStream.Player(controls.getPluginContainer(), {
            debug: true,
            useInternalControls: useInternalControls,
            bgColor: "#000000",
            fontColor: "#ffffff",
            onLoad: function() {
              try {
                this.loadPlayer(contentId, {autoplay: true});
                this.registerEventHandler(controls);
                controls.attachPlayer(this);
              }
              catch(e) {
                console.log("init: " + e);
              }
            }
          });

        }
        catch(e) {
          controls.onSystemMessage(e);
        };
      },
      function (err) {
        console.log(err.statusCode+': Error getting stream: '+err.message);
      }
    );
  });
