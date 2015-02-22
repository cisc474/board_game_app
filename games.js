$(document).ready(function(){
  var games_list = [];
  $.ajax({
    
    url: 'api/games',
    
    type: "GET",
    
    data: {"key":"value"},
    
    success: function(data){
      games_list = data;
      
      for (var i = 0; i < data.length; i++) {
          $('#jq-games').append("<li class=\"game\" title=\""+data[i].description+
          "\" data-index="+i+
          "><span class=\"bgg_thumb_wrapper\"><img class=\"bgg_thumb\" src=\"http:"
          +data[i].thumbnail+"\"/></span>"+data[i].game+ " :: "+data[i].playingtime 
          +" minutes</li>");
      };
      
      $("#jq-games .game").click(function(ev){
        var j = parseInt($(ev.currentTarget).attr('data-index'));
        var game_json = games_list[j];
        alert(game_json.game + " :: "+game_json.playingtime + " minutes");
      });
    
    }, 
    
    error: function(){
      $('body').html("Error happened");
    }
    
  });
});
