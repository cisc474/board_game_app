$(document).ready(function(){
  var games_list = [];
  $.ajax({
    
    url: 'api/games',
    
    type: "GET",
    
    data: {"key":"value"},
    
    success: function(data){
      games_list = data;
      
      for (var i = 0; i < data.length; i++) {
          $('.games').append("<li class=\"game\" data-index="+i+">"+data[i].game+ " :: "+data[i].playingtime +" minutes</li>");
      };
      
      $(".game").click(function(ev){
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

