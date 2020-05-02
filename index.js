// JavaScript Document
var url = require('url');
var http = require('http');
var MongoClient = require("mongodb").MongoClient;
var MongoUrl = "mongodb+srv://xmojic01:x5zG!EPfF4czEEy38bfM@tuftscomp20-38b0t.mongodb.net/test?retryWrites=true&w=majority";
var port = process.env.PORT || 8080;
http.createServer(function (req, res) {
	res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
	var stylesheet = "https://xmoj10.github.io/COMP20-Final/css/meal.css";//i link it to this style sheet
	var image = "https://i.imgur.com/LxR5Zpn.jpg"
	var body = "<html> <head> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <link rel='stylesheet' href='";
	body += stylesheet + "'> </head><body style='background-image: url(" + image +")'>";//this is where i set the background
	res.write(body, "utf-8");
	var string = url.parse(req.url, true).query;

	if (string.formType == 'upload') {
		upload(res, string.username, string.recipe, string.imgLink);
	} else if (string.formType == 'collections') {
		collections(res, string.username);
	}
}).listen(port);

function upload(res, username, recipeName, imgLink) {
	MongoClient.connect(MongoUrl, { useUnifiedTopology: true}, function(err, db) {
		if (err) { return res.write('Error Connecting to Database: ' + err); };
		var dbo = db.db("chefs-picks");
		var coll = dbo.collection("users");

		// Find Statement: Check if user exists
		result = coll.find().toArray(function (err, items) {
			if (err) {
				return console.log("Error in toArray Search!");
			}

			var userData = username;
			var recipeData = {
				recipeName: recipeName,
				imageLink: imgLink
			};

			var existCheck = false;
			for (i = 0; i < items.length; i++) {
				if (items[i].username == userData) {
					existCheck = true;
					break;
				}
			}
			if (existCheck == true) {
				coll.update({
					username: userData}, {$push: {recipes: recipeData}
				});
			} else if (existCheck == false) {
				var enterData = {
					username: userData,
					recipes: [recipeData]
				};
				coll.insertOne(enterData, function (err, res) {
					if (err) {
						console.log("Data Entry Error!");
						return;
					}
				}); // End Insert
			}
		}); // End Find Statement
	});
	res.write("Inserted " + recipeName + " into the database under user " + username + "!");
	res.write("<br><a href='https://xmoj10.github.io/COMP20-Final/'> Go back </a>");
	res.end();
	console.log(username);
	console.log(recipeName);
	console.log(imgLink);
};

function collections(res, username) {
	MongoClient.connect(MongoUrl, { useUnifiedTopology: true }, function (err, db) {
		if (err) { res.write('Error Connecting to Database: ' + err); return res.end(); };
		
		var my_db = db.db("chefs-picks");
		var data = my_db.collection("users");
		result = data.find().toArray(function (err, items) {
			if (err) { return console.log("Error in toArray Search!"); };
			var existCheck = false;
			var user = null;
			for (i = 0; i < items.length; i++) {
				if (items[i].username == username) {
					existCheck = true;
					user = items[i];
					break;
				}
			}
			if (existCheck) {
				// res.write("found a user");
				console.log(user.recipes);
				res.write("<a href='https://xmoj10.github.io/COMP20-Final/' style='font-size: 15pt'> Go back </a>");
				res.write("<div style='width: 100vw; display: flex; flex-wrap:wrap; justify-content:center;'>");
				for (i = 0; i < user.recipes.length; i++) {
					var recipe = user.recipes[i];
					console.log(recipe);
					res.write("<div> <h1>")
					res.write("recipe: ")
					res.write(recipe.recipeName);
					res.write("</h1>")
					res.write("<img src='");
					res.write(recipe.imageLink);
					res.write("' style='width: 400px;'></div>");
				}
				res.write("</div></body></html>");
				res.end();
			}
			if (!existCheck) {
				res.write("Could not find user! Try again! <br>");
				res.write("<a href='https://xmoj10.github.io/COMP20-Final/' style='font-size: 15pt'> Go back </a>");
				res.end();
			}
		});
	});
}