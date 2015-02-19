'use strict';

var myApp = angular.module('sampleapp', []);

var GameClass = function(){
    this.game = "A default game";
    this.playingtime = "Unknown";
    this.alert = function(){
        alert(this.game + " :: " + this.playingtime + " minutes");
    };
};

myApp.controller('GameController', ['$scope', '$http', function($scope, $http) {
    $scope.andy = "awesome";
    $scope.games = [{"game":"game1"}, {"game":"game2"}];
    $http.get('api/games').success(function(data, status, headers, config){
        $scope.games = [];
        angular.forEach(data, function(game){
            var thisgame = new GameClass();
            angular.extend(thisgame, game);
            $scope.games.push(thisgame);
        }, this);
    });
}]);
