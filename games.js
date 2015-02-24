$(document).ready(function(){
//I make a games_list from which we will work.
  var games_list = [];

/*This is how (or at least one of several ways) an AJAX request can be made.
  It takes a JSON object which should have url, type, data, success, and error 
  (others are possible some are optional).
  
  When the data comes back the success function should deal with it.
*/
  $.ajax({
    
    url: 'api/games',
    
    type: "GET",
    
    //for a simple GET request this will turn into url parameters api/games?key=value
    data: {"key":"value"},
    
    success: function(data){
      games_list = data;
      
      for (var i = 0; i < data.length; i++) {
      /* 
      This is where we do "jQuery" templating, we could of course use underscore templating too.
      Note that I'm using "i" as the index for the current game, I'm using "data-index" to store that i and 
      to reference it in "games_list" later when specific data is needed.
      */
          $('#jq-games').append("<li class=\"game\" title=\""+data[i].description+
          "\" data-index="+i+
          "><span class=\"thumb_wrapper\"><img class=\"thumb\" src=\"http:"
          +data[i].thumbnail+"\"/></span><span class=\"txt\">"+data[i].game+ " :: "+data[i].playingtime 
          +" minutes</span></li>");
      };
      
      /*
      So this next snippet has the heart of how to use jQuery for specific item 
      issues, and you can maybe begin to imagine how difficult it would be to now 
      delete a game from the list.
      */
      
      $("#jq-games .game").click(function(ev){
        //ev.currentTarget will be the element that was clicked.
        //data-index will have the "i" I left there from the above function
        var j = parseInt($(ev.currentTarget).attr('data-index'));
        var game_json = games_list[j];
        alert(game_json.game + " :: "+game_json.playingtime + " minutes");
      });
    
    }, 
    
    error: function(){
      $('body').html("Error happened");
    }
    
  });
  
  /* 
  This set of snippets is where I demonstrate using CSS state classes to change 
  a view. This could be done both in backbone and angular by having multiple 
  views for the same model. 
  */
  
  $("#gridmode").click(function(){
    $(".txt").hide();
    $(".game").removeClass("line");
  });
  
  $("#listmode").click(function(){
      $(".txt").show();
      $(".game").addClass("line");
  });
  
});
