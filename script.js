// const apiKey = "8d7cb35cdeae7a737f34484784f41497";
// let citySearchInput = $(".search-input-value");
// let btnSearch = $(".btn-search");

// let openWeatherMap =
//   "https://api.openweathermap.org/data/2.5/weather?" + "&appid=" + apiKey;

// let city, temperature, humidity, windspeed, UVindex;

// btnSearch.on("click", () => {
//   //   console.log(openWeatherMap);
//   searchValue = JSON.stringify(citySearchInput.val());
//   console.log(openWeatherMap);
// });

// console.log(openWeatherMap);

$(function() {
  $(".btn-search").on("click", function() {
    const apiKey = "8d7cb35cdeae7a737f34484784f41497";
    let citySearchInput = $(".search-input-value").val();
    let city, temperature, humidity, windspeed, UVindex;
    city = $("#city");
    temperature = $("#city-temp");
    humidity = $("#city-humidity");
    windspeed = $("#city-windspeed");
    UVindex = $("#city-UV");
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      citySearchInput +
      "&units=imperial" +
      "&appid=" +
      apiKey;
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(response => {
      city.text(response.name);
      temperature.text(response.main.temp + "°F");
      humidity.text(response.main.humidity + "g/m3");
      windspeed.text(response.wind.speed);

      UVindex.text(response.UV);
      console.log(response);
    });
  });
});
