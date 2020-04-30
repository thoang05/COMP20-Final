// JavaScript Document
var http = require('http');
var url = require('url');
var MongoClient = require('mongodb').MongoClient;
var MongoUrl = "mongodb+srv://comp20Final:comp20Final@cluster0-2wpep.mongodb.net/test?retryWrites=true&w=majority";


//Create Server
http.createServer(function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});

// Get Query Data	
var queryData = url.parse(req.url, true).query;

//Connect to Mongo with Outgoing Request		
	if (req.method == "GET") {
		MongoClient.connect(MongoUrl, {useUnifiedTopology: true}, function(err, db) {
			if (err) {
				return console.log("Error Connecting to Database: " + err);
			}
		
//Access DB
		var dbo = db.db("Final");
		var coll = dbo.collection("Users");
			
//Find Statement: Check if user exists 

		result = coll.find().toArray(function(err, items) {
			if (err){ return console.log("Error in toArray Search!");}
		
		var userData = queryData.username;
		var recipeData = {"recipeName": queryData.recipe, "imageLink": queryData.imgLink};

		var existCheck = false;
		for(var i=0; i<items.length; i++){
	
			if(items[i].username == userData){
				console.log("User already exists!")
				existCheck = true;
				break;
			} else {
				console.log("New user!");
			}
		}
			if(existCheck == true){
				console.log("Returning...");
				coll.update(
					{"username": userData},
					{$push: {recipes: recipeData}}
				)
			} else if(existCheck == false){
				console.log("Creating new uswer...");
				var enterData = {"username" : userData, "recipes": [recipeData]};
				coll.insertOne(enterData, function(err,res){
					if(err){
						console.log("Data Entry Error!")
						return;
					} 
				}) // End Insert	
			}
			
			
		}); // End Find Statement
        }) // End Mongo Connection
    } // End if GET statement

}).listen(8080);


