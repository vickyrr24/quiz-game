var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://vicky:123@cluster0-95hp6.mongodb.net/test?retryWrites=true&w=majority";


MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("quiz");
  var query = { };
  dbo.collection("questions").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});
