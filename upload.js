// JavaScript Document
var url = require("url");
var string = url.parse(req.url, true).query;
if (string.formType == "upload") {
  alert("UPLOADING");
  upload(username, recipeName, imgLink);
} else if (string.formType == "collections") {
  alert("COLLECTIONS");
}
// var MongoClient = require("mongodb").MongoClient;
// var MongoUrl = "mongodb+srv://trang:trangisgreat@tuftscomp20-38b0t.mongodb.net/test?retryWrites=true&w=majority";

function upload(username, recipeName, imgLink) {
  http.createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    MongoClient.connect(MongoUrl, { useUnifiedTopology: true }, function (
      err,
      db
    ) {
      if (err) {
        return res.write("Error Connecting to Database: " + err);
      }
      res.write("Connected to database!");
      res.end();
      var dbo = db.db("chefs-picks");
      var coll = dbo.collection("users");

      // Find Statement: Check if user exists

      result = coll.find().toArray(function (err, items) {
        if (err) {
          return console.log("Error in toArray Search!");
        }

        var userData = queryData.username;
        var recipeData = {
          recipeName: queryData.recipe,
          imageLink: queryData.imgLink,
        };

        var existCheck = false;
        for (i = 0; i < items.length; i++) {
          if (items[i].username == userData) {
            console.log("User already exists!");
            existCheck = true;
            break;
          } else {
            console.log("New user!");
          }
        }
        if (existCheck == true) {
          console.log("Returning...");
          coll.update(
            {
              username: userData,
            },
            {
              $push: {
                recipes: recipeData,
              },
            }
          );
        } else if (existCheck == false) {
          console.log("Creating new user...");
          var enterData = {
            username: userData,
            recipes: [recipeData],
          };
          coll.insertOne(enterData, function (err, res) {
            if (err) {
              console.log("Data Entry Error!");
              return;
            }
          }); // End Insert
        }
      }); // End Find Statement
    }); // End Mongo Connection
  });
}