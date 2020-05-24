console.log("Hello?");
const apiKey = "8d7cb35cdeae7a737f34484784f41497";
let city, temperature, humidity, windspeed, UVindex;
city = $("#city");
temperature = $("#city-temp");
humidity = $("#city-humidity");
windspeed = $("#city-windspeed");
UVindex = $("#city-UV");

function getData(URL) {
  $.ajax({
    url: URL,
    method: "GET"
  }).then(response => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();
    today = mm + "/" + dd + "/" + yyyy;
    city.text(response.name + " (" + today + ")");
    let icon = $("<img>");
    icon.attr(
      "src",
      "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png"
    );
    city.append(icon);

    temperature.text(response.main.temp + "°F");
    humidity.text(response.main.humidity + "%");
    windspeed.text(response.wind.speed + " MPH");
    let lon = response.coord.lon;
    let lat = response.coord.lat;
    let uvi =
      "http://api.openweathermap.org/data/2.5/uvi?&lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      apiKey;
    $.ajax({ url: uvi, method: "GET" }).then(UV => {
      UVindex.text(UV.value);
      $("#city-UV").css("visibility", "visible");
      if (UV.value <= 2) {
        UVindex.css("background-color", "green");
      } else if (UV.value > 2 && UV.value <= 5) {
        UVindex.css("background-color", "yellow");
      } else if (UV.value > 5 && UV.value <= 7) {
        UVindex.css("background-color", "orange");
      } else if (UV.value > 7) {
        UVindex.css("background-color", "red");
      }
    });
  });
}
function getForecast(URL) {
  $.ajax({ url: URL, method: "GET" }).then(response => {
    $(".result-5-day").empty();

    for (let i = 0; i < response.list.length; i += 8) {
      let timestamp = response.list[i].dt;
      let d = new Date(timestamp * 1000);
      let weekday =
        d.getUTCMonth() + "/" + d.getUTCDate() + "/" + d.getUTCFullYear();
      let div = $("<div>");
      div.attr("class", "weekday");
      $(".result-5-day").append(div);

      let currentDay = $("<div>");
      currentDay.attr("id", "current-day");
      currentDay.text(weekday);
      div.append(currentDay);
      let foreicon = $("<img>");
      foreicon.attr(
        "src",
        "http://openweathermap.org/img/wn/" +
          response.list[i].weather[0].icon +
          ".png"
      );
      foreicon.css({
        display: "block",
        "margin-left": "auto",
        "margin-right": "auto"
      });
      div.append(foreicon);

      let temp = $("<div>");
      temp.attr("id", "temp");
      temp.css({ display: "block", padding: "15px" });
      temp.text("Temp: " + response.list[i].main.temp + "°F");
      div.append(temp);
      let humid = $("<div>");
      humid.attr("id", "humidity");
      humid.text("Humidity: " + response.list[i].main.humidity + "%");
      humid.css({ display: "block", padding: "15px" });
      div.append(humid);
    }
  });
}

function toProperName(city) {
  let splitStr = city.toLowerCase().split(" ");
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(" ");
}

function addToHistory(value) {
  let btn = $("<button>");
  btn.attr("class", "prev-search");
  text = toProperName(value);
  btn.text(text);
  btn.on("click", target => {
    let queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      target.target.textContent +
      "&units=imperial" +
      "&appid=" +
      apiKey;
    getData(queryURL);
  });
  $(".search-input-history").append(btn);
  localStorage.setItem("lastSearch", text);
}
let lastSearch = localStorage.getItem("lastSearch");
if (lastSearch) {
  let lastBtn = $("<button>");
  lastBtn.attr("class", "prev-search");
  lastBtn.text(lastSearch);
  lastBtn.on("click", target => {
    let queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      target.target.textContent +
      "&units=imperial" +
      "&appid=" +
      apiKey;
    let forecastURL =
      "http://api.openweathermap.org/data/2.5/forecast?q=" +
      target.target.textContent +
      "&units=imperial" +
      "&appid=" +
      apiKey;
    getData(queryURL);
    getForecast(forecastURL);
    localStorage.setItem("lastSearch", toProperName(lastSearch));
  });
  $(".search-input-history").append(lastBtn);
}
$(".btn-search").on("click", () => {
  let citySearchInput = $(".search-input-value").val();
  let queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    citySearchInput +
    "&units=imperial" +
    "&appid=" +
    apiKey;
  let forecastURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    citySearchInput +
    "&units=imperial" +
    "&appid=" +
    apiKey;
  fetch(queryURL).then(response => {
    if (response.status == "404" || response.status == "400") {
      let toast = document.getElementById("toast");
      toast.className = "show";
      setTimeout(() => {
        toast.className = toast.className.replace("show", "");
      }, 3000);
    } else {
      getData(queryURL);
      getForecast(forecastURL);
      addToHistory(citySearchInput);
    }
  });
});
$(".search-input-value").keypress(enter => {
  if (enter.which == 13) {
    $(".btn-search").click();
  }
});
