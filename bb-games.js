$(document).ready(function(){

var Game = Backbone.Model.extend({
    defaults : { "game" : "This is a game"},
    description: function(){
        var template = _.template("<%= game %> :: for <%= minplayers %> to <%= maxplayers %> players in <%= playingtime %> minutes");
        return template(this.toJSON());
    },
    image_data : function(){
        var template = _.template("<span class=\"thumb_wrapper\"><img class=\"thumb\" src=\"http:<%= thumbnail %>\"/></span>");
        return template(this.toJSON());
    }
});

var Games = Backbone.Collection.extend({
    model : Game,
    url : "api/games"
});

var GameView = Backbone.View.extend({
    tagName: "li",
    className: "game",
    events: {"click" : "tell_more"},
    tell_more: function(){
        alert(this.model.description());  
    },
    render : function(){
        var textpart = "<span class=\"txt\">"+this.model.description()+"</span>";
        this.$el.html(this.model.image_data()+textpart);
        this.$el.attr("title", this.model.get("description"));
        return this;
    }
});

var GameApp = Backbone.View.extend({
    initialize : function(){
        this.games = new Games();
        this.listenTo(this.games, 'sync', this.displayGames, this);
        this.games.fetch();
    },
    
    displayGames : function(){
        var that = this;
        this.games.each(function(game){
            var gameView = new GameView({model: game});
            that.$("#game-list").append(gameView.render().el);
        });
    }
});

var myApp = new GameApp({el:"#bb-app"});

});