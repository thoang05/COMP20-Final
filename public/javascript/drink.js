function setUpAPI() {
    /* Main Function Processing */
    /* grabbing div & user_bev_type to write text to */
    output_div  = document.getElementById("beverage-image");
    output_div2  = document.getElementById("beverage-name");
    user_answer = document.getElementById("beverage_type").value;
    console.log(user_answer);
    
    if (user_answer == "surprise"){
        url = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
    }
    else if (user_answer == "alcoholic" || user_answer == "non_alcoholic") {
        url = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=" + user_answer;
    }
    else {
        /* do nothing, user hasn't made a choice */
        output_div.innerHTML = "<strong style='color: red;'> Please Select A Beverage Type </strong>";
        return;
    }
    
    /* creating a new HTTP request */
    request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            objData = request.responseText;
            objData = JSON.parse(objData);

            /* setting up seeding */
            drink_num = parseInt(Math.random() * objData.drinks.length);
            
            output_div.innerHTML = "";
            output_div2.innerHTML = objData.drinks[drink_num].strDrink + "<br>";
            output_div.innerHTML = "<img src='" + objData.drinks[drink_num].strDrinkThumb + "' style='width:400px'>";

            document.getElementById("recipeName").value = objData.drinks[drink_num].strDrink;
	    document.getElementById("imgLink").value = objData.drinks[drink_num].strDrinkThumb;
            
        } else if (request.readyState == 4 && request.status != 200) {
            alert("Could not connect to server, please try again!");
        };
    }
    request.send();
   
}

function validate() {
	if(document.getElementById("username").value == "" ){
		document.getElementById("errorBox").innerHTML = "Please Enter a Username";
		return false;
    }
}
