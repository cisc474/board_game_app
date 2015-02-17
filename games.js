$(document).ready(function(){
  $.ajax({
    url: 'api/games',
    type: "GET",
    data: {"key":"value"},
    success: function(data){
      for (var i = 0; i < data.length; i++) {
          $('body').append("<li>"+data[i].game+"</li>");
      }
    }, 
    error: function(){
      $('body').html("Error happened");
    }
  });
});
