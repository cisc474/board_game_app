# board_game_app
Make a board game app.  Learn LAMP and AJAX.

This is intended as an excuse to build your first API.

If you mimick what I have done then you will have built a (kinda) LAMP stack (Linux, Apache, MySql, PHP).  

When that term came to power was when PHP was used for most new websites as a way of making dynamic pages (rendered on the servers).  I like to think of the new era of LAMP as PHP for API purposes.  I went with PHP because it is the easiest server-side solution to play with.  We will explore others (or if you want to go your own way on this you can).

## The Database
My database has a single table *games* the column names come from BoardGameGeek.com's collection system (from now on BGG).

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

## Hosting your API

I recommend using cloud9, my version is here at https://ide.c9.io/andynovo/boardgameapp

Cloud9 will generate a public url for you to send me.  They also will simulate for you the experience of working from a server via a command line interface (common when working with servers, see SSH).  In order to get PHP to talk to SQLITE databases I had run the following command from the command-line:

    sudo apt-get install php5-sqlite

See the class website for more tutorial-style guidance.
