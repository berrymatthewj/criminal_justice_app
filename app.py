from flask import Flask, render_template
import pymongo
from bson.json_util import dumps
import os

# Create an instance of our Flask app.
app = Flask(__name__)

# Create connection variable
conn = os.environ.get('MONGODB_URI')

# Pass connection to the pymongo instance.
client = pymongo.MongoClient(conn)

# Connect to a database. Will create one if not already available.
db = client.project_2

# Set route
@app.route('/')
def index():
    # query = list(db.incarceration.find())
    return render_template("index.html")
    #query=query
    

@app.route('/loadData')
def loadData():
    query = list(db.incarceration.find({},{'_id': False}))
    return dumps(query)     


if __name__ == "__main__":
    app.run(debug=True)

