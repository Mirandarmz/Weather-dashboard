var apiKey = "baf0a769a729fefff82e16fcf9033cc5";
var searched=[];

$("#searchButton").click(function () {

  $("#todayTitle").empty();
  $("#todaySection").empty();

  var city = $("#cityInput").val();
  $(".forecasts").css("background-color", "#D9E8E8");
  $("#historyContainer").css("background-color", "#2E4C4D");

  if (city === "" || city == NaN) {
    alert("Please enter a city");
  }

  fetchToday(city);
  initStorage();
});

function fetchToday(city){
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
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
        console.log(data);
        //CITY AND DATE
      //$("#todaySection").empty();
      var title = document.createElement("h3");
      title.textContent = city + " (" + moment(data.dt.value).format("MMM D, YYYY") + ") ";;
      $("#todayTitle").append(title);

      //ICON
      var icon = document.createElement("img")
      icon.setAttribute("src", "https://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png");
      icon.setAttribute("width","70px");
      icon.setAttribute("height","70px");
      title.append(icon);

      //TEMP
      var temp = document.createElement("p");
      temp.textContent = "Temperature: " + data.main.temp +" ºF";
      temp.style.marginLeft="20px";
      $("#todaySection").append(temp);


      //HUMIDITY
      var hum = document.createElement("p");
      hum.textContent = "Humidity: " + data.main.humidity + " %";
      hum.style.marginLeft="20px";
      $("#todaySection").append(hum);

      //WIND
      var wind = document.createElement("p");
      wind.textContent = "Wind: " + data.wind.speed + " MPH";
      wind.style.marginLeft="20px";
      $("#todaySection").append(hum);

      //UV INDEX NEEDS A NEW FETCH AND A DISPLAY IN ITS THENN
      var lat= data.coord.lat;
      var long = data.coord.lon;
      fetchUV(lat,long)

      //DISPLAY 5 DAY FORECAST
      fetchForecast(city);

    });
}

function fetchUV(lat,long){
  fetch(
    "https://api.openweathermap.org/data/2.5/uvi?appid="+apiKey+"&lat="+lat+"&lon="+long,
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
      console.log(data);//
      var index=data.value;
      var uv = document.createElement("p");
      uv.textContent = "UV Index: " + index;
      uv.style.marginLeft="20px";
      if(index<=2){
        uv.style.backgroundColor="rgb(0, 128, 0,.60)";
      }else{
        if(index<=5){
          uv.style.backgroundColor="rgb(255, 255, 0,.60)";
        }else{
          if(index<=7){
            uv.style.backgroundColor="rgb(255, 87, 51,.80)";
          }else{
            if(index<=10){
              uv.style.backgroundColor="rgb(255, 0, 0,.80)";
            }
            else{
              uv.style.backgroundColor="rgb(128, 0, 128,.60)";
            }
          }
        }
      }
      $("#todaySection").append(uv);

    });
}

function fetchForecast(city){
    var apiURL = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=imperial&appid="+ apiKey;
    $("#forecastTitle").empty();
    $("#forecastSection").empty();

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           $("#forecastTitle").text("5 Day Forecast");
           $("#forecastTitle").css("margin-left","20px");
           $("#forecastSection").css("heigth","800px");

        for(var i=5; i < data.list.length; i=i+8){
       var forecast = data.list[i];
        
       
       var forecastCard=document.createElement("div");
       forecastCard.classList = "card bg-info text-light m-4 col-2";

       //console.log(dailyForecast)

       //create date element
       var date = document.createElement("h5")
       date.textContent= moment.unix(forecast.dt).format("MMM D, YYYY");
       date.classList = "card-header text-center"
       forecastCard.appendChild(date);
 
       
       //create an image element
       var icon = document.createElement("img")
       icon.classList = "card-body text-center";
       icon.setAttribute("src", "https://openweathermap.org/img/wn/"+forecast.weather[0].icon+"@2x.png");  
       forecastCard.appendChild(icon);
       
       //create temperature span
       var temp=document.createElement("span");
       temp.classList = "card-body text-center";
       temp.textContent = forecast.main.temp + " °F";
       forecastCard.appendChild(temp);

       var hum=document.createElement("span");
       hum.classList = "card-body text-center";
       hum.textContent = forecast.main.humidity + "  %";
       forecastCard.appendChild(hum);

        // console.log(forecastEl);
       //append to five day container
       $("#forecastSection").append(forecastCard);
    }

        });
    });
}

//Rendering of todos written
function renderSearch() {
  console.log("Searched"+searched);
  for (var i = 0; i < searched.length; i++) { //Loop that sets the value of the text areas to the ones saved on the storage 
    var search = searched[i];
    var searchBtn=document.createElement("button");
    searchBtn.textContent = searched[i].city;
    searchBtn.classList = "d-flex w-100 btn-light border p-2";
    searchBtn.setAttribute("data-city",search.city)
    searchBtn.setAttribute("type", "submit");

    $("#historyContainer").append(searchBtn);
 }
}

//Function executed when the page initially loads to pull elements saved in the local storage 
function initStorage() {
  var storedSearch = JSON.parse(localStorage.getItem("searched"));

  if (storedSearch !== null) {
    searched = storedSearch;
    console.log("Searched"+searched);
    renderSearch();
  }

}

function saveCity(){
  var todoText=searched[i].city;
  localStorage.setItem("searched", JSON.stringify(searched))
  console.log("Searched"+searched);
  renderSearch();
}

initStorage();



// pastSearch();

//cityFormEl.addEventListener("submit", formSumbitHandler);
//pastSearchButtonEl.addEventListener("click", pastSearchHandler);


