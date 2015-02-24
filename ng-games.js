'use strict';


/*
This is the usual opening of an angular "app" which is to define a module 
(In my estimation module and app are the same thing).
most definitions in angular allow "dependency injection", that is, you can state
in the square brackets any other modules, libraries, objects, etc that this module
will rely on.
*/

var myApp = angular.module('sampleapp', []);

/* 
This is the first "Class" that we have made in the traditional Javascript method
In javascript classes are functions and you can instantiate an object by calling
new GameClass() (as below).  Inside the function you will use the keyword "this"
to refer to the object
*/

var GameClass = function(){
  this.game = "A default game";
  this.playingtime = "Unknown";
  // These default values will eventually be replaced
  this.alert = function(){
      alert(this.game + " :: " + this.playingtime + " minutes");
  };
};

/*
recall that myApp is our module, the "controller" method defines a controller.

Typically each "view" has one controller and the two will share a "scope" object

The square brackets have the dependencies of the controller (names "GameController")

In this case it will use the $scope class and $http class from angular.  Those 
are passed into the final function which is the initialization function of the GameController.
*/

myApp.controller('GameController', ['$scope', '$http', function($scope, $http) {
    //these initial values are silly tests of concept that I left in
    $scope.andy = "awesome";
    $scope.games = [{"game":"game1"}, {"game":"game2"}];
    
    /*
    
    This is how AJAX is performed with angular, a get request is explicitely made to api/games 
    and a success callback function defined.  The success function will receive some standard 
    feedback from the call.  Data will be the fetched data.
    */
    $http.get('api/games').success(function(data, status, headers, config){
       $scope.games = [];
    /*
    angular.forEach is a quick way of iterating through an array
    In general Angular aims to not need underscore or jQuery two classic libraries in web devel
    Angular aims to be a one-stop shop.  Angular is google based and the others are community based, think 
    google vs github
    */
       angular.forEach(data, function(game){
           var thisgame = new GameClass();
         /* extending is a nice way to "subclass" a class, maybe a better way to 
            put it is this: extend is how you mix-in a json object into a class.
            here I wanted a method for my GameObjects but I wanted the values 
            from the server without having to know what the server would always 
            provide me*/
           angular.extend(thisgame, game);
           
           //push is the javascript way of putting something at the end of an array
           $scope.games.push(thisgame);
       }, this);
    });
}]);