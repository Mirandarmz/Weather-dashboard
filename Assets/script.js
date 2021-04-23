//Generated 2 global variables -> my personal api key to access open weather api, array for local storage functionality and an index that will be used later
var apiKey = "baf0a769a729fefff82e16fcf9033cc5";
var searched = [];
var i = 0;

//Functionality for the search button on click after entering a city
$("#searchButton").click(function () {
  //First make the containers appear and retrieve the value of the input
  var city = $("#cityInput").val();
  $(".forecasts").css("background-color", "#D9E8E8");

  //Check if something was entered in the input, if not send an alert
  if (city === "" || city == NaN) {
    alert("Please enter a city");
  }

  //Make the info search with the input value
  fetchToday(city);
});

//Function to fetch today's forecast using the city entered in the input
function fetchToday(city) {
  //In case the user clicks again, make sure all past elements created and appended are deleted
  $("#todayTitle").empty();
  $("#todaySection").empty();

  //fetch using the city and appy key
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=" +
    apiKey,
    {
      method: "GET", //GET is the default.
      credentials: "same-origin", // include, *same-origin, omit
      redirect: "follow", // manual, *follow, error
    }
  )
    //First then, returns a promise
    .then(function (response) {
      return response.json();
    })
    //Second then, executes function with the array
    .then(function (data) {
      //Creates elements, adds text and appends the elements 
      //For city and date
      var title = document.createElement("h3");
      title.textContent =
        city + " (" + moment(data.dt.value).format("MMM D, YYYY") + ") ";
      $("#todayTitle").append(title);

      //For icon
      var icon = document.createElement("img");
      icon.setAttribute(
        "src",
        "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
      );
      icon.setAttribute("width", "70px");
      icon.setAttribute("height", "70px");
      title.append(icon);

      //For temperature
      var temp = document.createElement("p");
      temp.textContent = "Temperature: " + data.main.temp + " ºF";
      temp.style.marginLeft = "20px";
      $("#todaySection").append(temp);

      //For humidity
      var hum = document.createElement("p");
      hum.textContent = "Humidity: " + data.main.humidity + " %";
      hum.style.marginLeft = "20px";
      $("#todaySection").append(hum);

      //For wind
      var wind = document.createElement("p");
      wind.textContent = "Wind: " + data.wind.speed + " MPH";
      wind.style.marginLeft = "20px";
      $("#todaySection").append(hum);

      //UV Index needs a new fetch and its own display
      var lat = data.coord.lat;
      var long = data.coord.lon;
      fetchUV(lat, long);

      //Call function to display the 5 day forecast 
      fetchForecast(city);

      //Initialize storage functionality
      if(searched.indexOf(city)==-1){
        searched.push(city);
      }else{
        return;
      }
      storeSearch();
      renderSearch();
    });
}

//Function to fetch the uv index, receives the latitud and longitud from the first fetch 
function fetchUV(lat, long) {
  fetch(
    "https://api.openweathermap.org/data/2.5/uvi?appid=" +
    apiKey +
    "&lat=" +
    lat +
    "&lon=" +
    long,
    {
      method: "GET", //GET is the default.
      credentials: "same-origin", // include, *same-origin, omit
      redirect: "follow", // manual, *follow, error
    }
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //Retrieves the index, generates p element and sets text
      var index = data.value;
      var uv = document.createElement("p");
      uv.textContent = "UV Index: " + index;
      uv.style.marginLeft = "20px";

      //Depending on the index, sets the color 
      //Green for low, yellow for moderate, orange for high, red for very high, purple for extreme 
      if (index <= 2) {
        uv.style.backgroundColor = "rgb(0, 128, 0,.60)";
      } else {
        if (index <= 5) {
          uv.style.backgroundColor = "rgb(255, 255, 0,.60)";
        } else {
          if (index <= 7) {
            uv.style.backgroundColor = "rgb(255, 87, 51,.80)";
          } else {
            if (index <= 10) {
              uv.style.backgroundColor = "rgb(255, 0, 0,.80)";
            } else {
              uv.style.backgroundColor = "rgb(128, 0, 128,.60)";
            }
          }
        }
      }
      //Appends the newly created uv index element 
      $("#todaySection").append(uv);
    });
}

//Fetch the 5 day forecast 
function fetchForecast(city) {
  var apiURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=imperial&appid=" +
    apiKey;

  //First delete every element we could already have in the container 
  $("#forecastTitle").empty();
  $("#forecastSection").empty();

  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      //Set title of container and style 
      $("#forecastTitle").text("5 Day Forecast");
      $("#forecastTitle").css("margin-left", "20px");

      //Loop 5 times through the for, creating elements, their content and appending them to create the forecast card 
      for (var i = 5; i < data.list.length; i = i + 8) {
        var forecast = data.list[i];

        //We create a card using bootstrap cards 
        var forecastCard = document.createElement("div");
        forecastCard.classList = "card bg-info text-light m-4 col-2";

        //Generate date element and append to the card 
        var date = document.createElement("h5");
        date.textContent = moment.unix(forecast.dt).format("MMM D, YYYY");
        date.classList = "card-header text-center";
        forecastCard.appendChild(date);

        //Generate image element and append to the card, we do so by changing the source of the img to the link provided by the data 
        var icon = document.createElement("img");
        icon.classList = "card-body text-center";
        icon.setAttribute(
          "src",
          "https://openweathermap.org/img/wn/" +
          forecast.weather[0].icon +
          "@2x.png"
        );
        forecastCard.appendChild(icon);

        //Generate temperature elemetn and append to the card 
        var temp = document.createElement("span");
        temp.classList = "card-body text-center";
        temp.textContent = forecast.main.temp + " °F";
        forecastCard.appendChild(temp);

        //Generate humidity element and append to the card 
        var hum = document.createElement("span");
        hum.classList = "card-body text-center";
        hum.textContent = forecast.main.humidity + "  %";
        forecastCard.appendChild(hum);

        //Append card to forecast container 
        $("#forecastSection").append(forecastCard);
      }
    });
  });
}


function initStorage(){
  searched=JSON.parse(localStorage.getItem("searched")) || [];
  console.log(searched);
  for(var j=0;j<searched.length;j++){
    var searchBtn = document.createElement("button");
    searchBtn.textContent = searched[j];
    searchBtn.classList = "d-flex w-100 btn-light border p-2";
    searchBtn.setAttribute("data-city", searched[j]);
    $("#historyContainer").append(searchBtn);
  }

}

//Rendering of todos written
function renderSearch() {
  var search = searched[i];

  var searchBtn = document.createElement("button");
  searchBtn.textContent = searched[i];
  searchBtn.classList = "d-flex w-100 btn-light border p-2";
  searchBtn.setAttribute("data-city", searched[i]);
  searchBtn.setAttribute("type", "submit");
  $("#historyContainer").append(searchBtn);
  i++;
}

function storeSearch() {
  localStorage.setItem("searched", JSON.stringify(searched));
}

$("#historyContainer").click(function (event) {
  var city = event.target.getAttribute("data-city");
  if (city) {
    $(".forecasts").css("background-color", "#D9E8E8");
    fetchToday(city);
  }
});

initStorage();