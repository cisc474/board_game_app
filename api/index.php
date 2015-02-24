<?php

//This line consults PHPs super global $_SERVER to get the method typically one of GET, POST, PUT, DELETE
$verb = $_SERVER['REQUEST_METHOD'];

//This line gets the full URI including domain path and parameters
$uri = $_SERVER['REQUEST_URI'];

//this uses a PHP function parse_url to get an associative array (think: key value pairs)
//this array has all of the interesting parts of the URL
$url_parts = parse_url($uri);
$path = $url_parts["path"];
//this fetches the parameters namely the blah.com?param1=value1&param2=value2
$parameters = $url_parts["query"];

//To learn more consult the helpful PHP documentation or do a print_r(whatever) here 
// to see what is happening

//This is some hack-y code to figure out which part of the path is the requested 
//object, it finds "api" inside of "/api/whatever/they/typed" and returns "/whatever/they/typed"
$prefix = "api";
$ind = strpos($path, $prefix);
$request = substr($path, $ind + strlen($prefix));

//Here I check if the part after api is exactly "/games" anything else is given a 404
//If you wanted a better API you might want to explode the request string by "/" and examine the parts
if ($request == "/games") {
  //this is to allow more than one type of "/games" request, think PUT POST etc
  if ($verb == "GET") {
    //this is the basic way of getting a database handler from PDO, PHP's built in quasi-ORM
    $dbhandle = new PDO("sqlite:bgg.sqlite") or die("Failed to open DB");
    if (!$dbhandle) die ($error);
 
    //this is a sample query which gets some data, the order by part shuffles the results
    //the limit 0, 10 takes the first 10 results.
    // you might want to consider taking more results, implementing "pagination", 
    // ordering by rank, etc.
    $query = "SELECT objectname as game, games.objectid, rank, playingtime, minplayers, maxplayers,
          thumbnail, image, description, categories
          from games left join extra on (games.objectid = extra.objectid) order by random() limit 0, 10";
    //this next line could actually be used to provide user_given input to the query to 
    //avoid SQL injection attacks
    $statement = $dbhandle->prepare($query);
    $statement->execute();
    //The results of the query are typically many rows of data
    //there are several ways of getting the data out, iterating row by row,
    //I chose to get associative arrays inside of a big array
    //this will naturally create a pleasant array of JSON data when I echo in a couple lines
    $results = $statement->fetchAll(PDO::FETCH_ASSOC);
    //this part is perhaps overkill but I wanted to set the HTTP headers and status code
    //making to this line means everything was great with this request
    header('HTTP/1.1 200 OK');
    //this lets the browser know to expect json
    header('Content-Type: application/json');
    //this creates json and gives it back to the browser
    echo json_encode($results);
  
  } else {
    //Not a GET request gets a 404
    header('HTTP/1.1 404 Not Found');
  
  }
} else {
  //Not a /games request gets a 404  
  header('HTTP/1.1 404 Not Found');

}

?>
