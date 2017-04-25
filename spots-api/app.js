// app.js
// Bootstrapping the express application
const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const path = require('path');

// Load environment secret variables
require('dotenv').config({
  path: path.join(__dirname, '../.env')
});

// Connection URL
const mongoURL = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@ds119210.mlab.com:19210/hotspotdb`;

// Allow Cross origin requests
app.use(cors());

// Allow JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// Use connect method to connect to the server
MongoClient.connect(mongoURL, function(err, db) {
  if (err) {
    throw err;
  }
  console.log("Connected successfully to mongo");
  db.ObjectId = mongo.ObjectId;

  // Load in routes:
  app.get('/alive', require('./api/alive.js')(db));
  app.get('/spots', require('./api/get-spots.js')(db));
  app.get('/spots/:id', require('./api/get-spot.js')(db));
  app.post('/spots', require('./api/post-spots.js')(db));
  app.put('/spots/:id', require('./api/put-spot.js')(db));
});

// only bootstrapped, not run (for testing)
module.exports = app;
