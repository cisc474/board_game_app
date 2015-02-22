# board_game_app
Make a board game app.  Learn LAMP and AJAX.

This is intended as an excuse to build your first API.

If you mimick what I have done then you will have built a (kinda) LAMP stack (Linux, Apache, MySql, PHP).  

When that term came to power was when PHP was used for most new websites as a way of making dynamic pages (rendered on the servers).  I like to think of the new era of LAMP as PHP for API purposes.  I went with PHP because it is the easiest server-side solution to play with.  We will explore others.

If you really want to play with scripting, nodejs, or mongodb then I have provided a csv file with the data and you can hack at it anyway you see fit.  Just share you code with me here on github (it won't be public).

## The Database
My database started with a single table *games* the column names come from BoardGameGeek.com's collection system (from now on BGG).  I then used python to scrape the boardgamegeek API for more data about my games in particular.  This data is saved in the *extra* table.

The *games* table has 9 columns:

+ objectname *The game's name*
+ objectid *BGGs internal id for games*
+ average *average rating by all BGG users*
+ avgweight *average weight as ranked by BGG users*
+ rank *overall standing of the game on BGG, 1 is best, 0 is an expansion and doesn't count*
+ minplayers *minimum allowable number of players*
+ maxplayers *maximum number of players*
+ playingtime *number of minutes to play the game (in the worst case)*
+ bggbestplayers *recommended number of players (three versions, NA is no guidance, a single number is the only recommended number of players, a-- b-- c means a b and c are recommended for this game)*

The *extra* table has five columns:

+ objectid *matches the games table*
+ description *a long description of the game*
+ thumbnail *a url for a boardgamegeek thumbnail of this game's box cover (format: //domain.com/filename so insert your own protocol or rely on the browser)*
+ image *a url for a larger bgg image of this game*
+ categories *an Andy crafted string with many common words describing the game joined together by " @@ "*

If you are interested in server-side scripting I have provided the Python script I used to create the new table.  It gathers the objectid values and for each one consults the 3rd-party BGG XML API for additional data.  That data is parsed and converted into a format that works for us.  This is our first round of *web-scraping* and it is one of many options for playing with 3rd-party services.  If you want to run my script BeautifulSoup was not natively installed on cloud9 so I ran this command to get it:

    sudo apt-get install python-bs4

Then

    cd api
    python ./fetch_desc_bs4.py

It should output gameid and categories for each game, will take 3-5 minutes to run, after that you'll have an extra table. 


**Two SQL commands to be aware of:**

    select objectname, thumbnail from games JOIN extra on (games.objectid = extra.objectid)
    select objectname from games where bggbestplayers LIKE '%3%'

*JOIN* is a way of gluing together results from two tables, there will be an *ON* statement which says which column in your left table matches which column in your right table.  In the above example I will glue *games* to *extra* on *objectid* and return *objectname* from *games* and *thumbnail* from *extra*.  There are several types of *JOIN*s namely *LEFT JOIN* *RIGHT JOIN* *INNER JOIN* *OUTER JOIN* and plain old *JOIN*.  These will vary whether or not to return a row when either the left or right column doesn't have a match.

*LIKE* is a conditional statement which can stand-in for *=* and allows wild-cards.  So if I want to find all games which are recommended for 3 players I could use the above statement (*%* is a wildcard).  In this case any rows for which the string from the given column contains the digit 3 would be returned.

## Hosting your API

I recommend using cloud9, my version is here at https://ide.c9.io/andynovo/boardgameapp

Cloud9 will generate a public url for you to send me.  They also will simulate for you the experience of working from a server via a command line interface (common when working with servers, see SSH).  In order to get PHP to talk to SQLITE databases I had run the following command from the command-line:

    sudo apt-get update
    sudo apt-get install php5-sqlite

If you want to work on a GitHub Project from Cloud9 do the following:

+ fork this repo
+ clone that repo in cloud9
+ get the php-sqlite package using apt-get
+ edit files
+ commit and push

To commit and push from the command line use two commands roughly like this:

    git commit -am 'I fixed the pdo connection'
    git push

See the class website for more tutorial-style guidance.
