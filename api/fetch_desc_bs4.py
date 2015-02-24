#importing the libraries I want, an sqlite interface, a url requester, and an XML parsing library

import sqlite3, urllib2, bs4 as BeautifulSoup
#sudo apt-get install python-bs4
#That's how I was able to install the latest beautiful soup

#this bit I have to google search everytime.
con = sqlite3.connect('bgg.sqlite')
cur = con.cursor()

#this gets an array of responses, not in the best format, I made all of this by
#FIRST going into a python session then playing with the results until I liked it
cur.execute('select objectid as id from games')
data = cur.fetchall()
#con.commit will make sure the database is saved and the next "transaction" can begin
con.commit()

#Note the "create table if not exists" part, that's so I can run this script over and over
#even after I've had to debug
cur.execute('create table if not exists extra (objectid integer primary key, description text, thumbnail text, image text, categories text)')
con.commit()

#this is a simple way of cleaning up the data that came out of my earlier query
#I use this lambda trick often in python, it's a simple one-off function which 
#"returns" the part after the : on each element in data
gameids = map(lambda x: x[0], data)

#a simple Python Class just to be classy
class DescRow:
    def create_sql(self):
        return ["insert or replace into extra (objectid, description, thumbnail, image, categories) values (?, ?, ?, ?, ?)", (self.objectid, self.description, self.thumbnail, self.image, self.categories)]

#another simple procedure to hit the BGG API in the right way
def url_gen(gameid):
    return "http://www.boardgamegeek.com/xmlapi2/thing?stats=1&id=%s" % gameid

#one main game look up
def fetch_game_data(gameid):
    #this gets the server response from the BGG API
    response = urllib2.urlopen(url_gen(gameid))
    #this saves the text response in one long string
    xml = response.read()
    #this creates a beautifulsoup tree out of the xml
    #I used to do all of this by hand using regular expressions
    #Now I dig using beautifulsoup to parse my webpages and xml responses
    bs_tree = BeautifulSoup.BeautifulSoup(xml)
    
    game_data = DescRow()
    game_data.objectid = gameid
    
    #This is where I really needed a "by-hand" example to get it right but
    # this will go to the first "description" tag and return the contents as a string
    game_data.description = bs_tree.find('description').text
    #ditto for "thumbnail" and "image" after that
    game_data.thumbnail = bs_tree.find('thumbnail').text
    game_data.image = bs_tree.find('image').text
    
    #this is my way of making a category data set for the DB
    #if someone is in a particular mood, party games or card games or whatever
    #this might do the job
    game_data.categories = " @@ ".join(map(lambda x: x.attrs['value'], bs_tree.find_all('link', attrs={"type": "boardgamecategory"})))
    
    return game_data

#this procedure does one row creation transaction
def create_row(gameid, cursor, con):
    game_data = fetch_game_data(gameid)
    sql_query = game_data.create_sql()
    cursor.execute(sql_query[0], sql_query[1])
    con.commit()
    return game_data


import time
#I used this while debugging, I'll leave it here to show that I am very human.
errors = []
#This is the main program, it goes through each gameid and creates a row
#I put a 1 second pause between each command because I was having the API
#cut me off or get backed up, this worked for making sure the API was friendly to me
for gameid in gameids:
    gdata = create_row(gameid, cur, con)
    time.sleep(1)
    #this is just so I know that things were working
    print gdata.objectid, gdata.categories
