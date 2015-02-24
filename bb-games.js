$(document).ready(function(){

/*Backbone is made to play with jQuery and Underscore. 
 I wrapped this code in the document ready call back like normal jQuery code.
 This prevents attaching to elements that don't yet exist.
*/


/*
Backbone really runs off of Models, Collections, and Views.  
When I first picked it up I felt
frustrated by the fact that a View was not actually a "view" in the proper 
MVC sense (Model, View, Controller).  

As I learned I became comfortable with the fact that Backbone Views are really 
more of a Controller and the HTML is the actual "view".
As I learned to think in Backbone I realized that the choices that they made are 
meant to be agnostic to your architecture choices.

It is a simple library just for adding structure to your code, but still leaving
most choices to you.
*/


/* 
The following snippet defines my Game class, it is a subclass (via extend) of 
Backbone's Model class.  The JSON input is the functions and attributes you want
to mix-in.  Some attributes are special keywords, like "defaults" (check backbonejs.org).

Models come with a getter and a setter for accessing properties of the model.

So myobject.get("game") will return "This is a game"

myobject.set({"game": "new value"}) will update it, but also fire a 
"change:game" and "change" event that other objects can listen for.

Backbone is very naturally event driven.

Description and image_data are methods of my own creation.
*/


var Game = Backbone.Model.extend({
    defaults : { "game" : "This is a game"},
    description: function(){
        /*
        In these function I use underscore templating from underscore one of the 
        best javascript libraries.  (Underscore has all sorts of useful functionality, making javascript 
        feel more like python.)  Underscore templating is one of many templating options, 
        <% %> will evaluate javascript <%= %> will print the contents.
        <% for(var i = 0; i < whatever.length; i++){ %> STUFF <% } %> will print STUFF some number of times.
        
        The compiled template will take in a JSON object that gets evaluated.
        */
        var template = _.template("<%= game %> :: for <%= minplayers %> to <%= maxplayers %> players in <%= playingtime %> minutes");
        return template(this.toJSON());
    },
    image_data : function(){
        var template = _.template("<span class=\"thumb_wrapper\"><img class=\"thumb\" src=\"http:<%= thumbnail %>\"/></span>");
        return template(this.toJSON());
    }
});

/* 
   Backbone Collections are used as sets of models, but really they are made to 
   receive rows of data.  They emit all of the model's events and "add" and "remove" 
   events to any listeners.  The url is used as an API hook (and the models are presumed to 
   have an API collectionurl/:id).  Now a .fetch() command will to a GET request to the url,
   a .save() command might do a POST or PUT request.
*/

var Games = Backbone.Collection.extend({
    model : Game,
    url : "api/games"
});

/* This is where the model and UI merge.  Some people say that Backbone is a 
Model View Presenter framework, and this is the "Presenter" of the model.

Backbone Views have some things to get used to.  They all have a 
special attribute called "el" which is the html element that this view has control 
of.  If you don't pass in an "el" property at instantiation then the "el"-ement 
of this view is virtual (off-screen).

If you specify "tagName" and "className" then the el will be wrapped up as a 
tag with a class (there is also a way to set attributes of the el).  I remember 
needing to get used to this "el" concept at first.  Talk to me if you want help.
Views also come with an "myview.$el" property which is a jQuery selected version 
of your element.

If you specify an "events" JSON object then they will be used to register call
back functions for certain UI events (like click), they can take a selector too
like "click .buttons"  : "some_action" which would mean that all things with 
"buttons" class inside your el-ement now have a click listener which will trigger 
thisview.some_action();

All views come with a no-op render function.  This is where you are supposed to 
fill $el with whatever you want when the view should render.  It's up to you 
if you want to render every time the model changes or whenever.
*/

var GameView = Backbone.View.extend({
    tagName: "li",
    className: "game",
    events: {"click" : "tell_more"},
    tell_more: function(){
        alert(this.model.description());  
    },
    render : function(){
        var textpart = "<span class=\"txt\">"+this.model.description()+"</span>";
        // the next line does the actual "rendering"
        this.$el.html(this.model.image_data()+textpart);
        // this adds some attributes (so a mouseover will give more data)
        this.$el.attr("title", this.model.get("description"));
        // this is a trick I picked up from experts.  This allows the view to 
        // be completely off stage and the big brain of the app to decide 
        // where to put this view (or to replicate it 10 times or whatever)
        return this;
    }
});

/* 
This is how I decided to make my AppClass.  I'm using Backbone's View Class but 
I'm not presenting a model or collection or anything, just a habit I guess.

I could say that any Backbone class will run any function you pass it called 
initialize when a new object is instantiated from that Class.
*/

var GameApp = Backbone.View.extend({
    initialize : function(){
        // This creates a new Games collection
        this.games = new Games();
        // this sets up a listener for when the server has responded
        this.listenTo(this.games, 'sync', this.displayGames, this);
        //this asks the server for the data
        this.games.fetch();
    },
    
    displayGames : function(){
        //this is a method of using "this" deeper in a function, another habit of mine
        var that = this;
        //this each is an underscore inherited method of a backbone collection
        // which runs a callback for each "game"
        this.games.each(function(game){
            //for each game this creates a game view with the given game as the 
            // view's model
            var gameView = new GameView({model: game});
            // this is where I use the "return this" trick from the render function
            // this is what takes the virtual "el" and displays it on screen.
            that.$("#game-list").append(gameView.render().el);
        });
    }
});

//This is what starts the App by instantiating a new "GameApp", I'm using "#bb-app" as the 
//apps "el"-ement.
var myApp = new GameApp({el:"#bb-app"});

});