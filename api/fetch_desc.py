import sqlite3, urllib2, BeautifulSoup

con = sqlite3.connect('bgg.sqlite')

cur = con.cursor()
cur.execute('select objectid as id from games')
data = cur.fetchall()
con.commit()

cur.execute('create table if not exists extra (objectid integer primary key, description text, thumbnail text, image text, categories text)')
con.commit()

gameids = map(lambda x: x[0], data)

class DescRow:
    def create_sql(self):
        return ["insert or replace into extra (objectid, description, thumbnail, image, categories) values (?, ?, ?, ?, ?)", (self.objectid, self.description, self.thumbnail, self.image, self.categories)]

def url_gen(gameid):
    return "http://www.boardgamegeek.com/xmlapi2/thing?stats=1&id=%s" % gameid

def fetch_game_data(gameid):
    response = urllib2.urlopen(url_gen(gameid))
    xml = response.read()
    bs_tree = BeautifulSoup.BeautifulSoup(xml)
    game_data = DescRow()
    game_data.objectid = gameid
    game_data.description = bs_tree.first('description').text
    game_data.thumbnail = bs_tree.first('thumbnail').text
    game_data.image = bs_tree.first('image').text
    game_data.categories = " @@ ".join(map(lambda x: x.attrMap['value'], bs_tree.findAll('link', attrs={"type": "boardgamecategory"})))
    return game_data

def create_row(gameid, cursor, con):
    game_data = fetch_game_data(gameid)
    sql_query = game_data.create_sql()
    cursor.execute(sql_query[0], sql_query[1])
    con.commit()
    return game_data

import time
errors = []
for gameid in gameids:
    gdata = create_row(gameid, cur, con)
    time.sleep(1)
    print gdata.objectid, gdata.categories
