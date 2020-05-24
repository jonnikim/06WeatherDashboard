$(() => {
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
      city.text(response.name);
      temperature.text(response.main.temp + "°F");
      humidity.text(response.main.humidity + "g/m3");
      windspeed.text(response.wind.speed + "mph");
      let lon = response.coord.lon;
      let lat = response.coord.lat;
      let uvi =
        "http://api.openweathermap.org/data/2.5/uvi?&lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        apiKey;
      $.ajax({ url: uvi, method: "GET" }).then(coord => {
        UVindex.text(coord.value);
        $("#city-UV").css("visibility", "visible");
        if (coord.value <= 2) {
          UVindex.css("background-color", "green");
        } else if (coord.value > 2 && coord.value <= 5) {
          UVindex.css("background-color", "yellow");
        } else if (coord.value > 5 && coord.value <= 7) {
          UVindex.css("background-color", "orange");
        } else if (coord.value > 7) {
          UVindex.css("background-color", "red");
        }
      });
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
      getData(queryURL);
      localStorage.setItem("lastSearch", toProperName(lastSearch));
    });
    $(".search-input-history").append(lastBtn);
  } else {
    return;
  }
  $(".btn-search").on("click", () => {
    let citySearchInput = $(".search-input-value").val();
    let queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
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
        addToHistory(citySearchInput);
      }
    });
  });
});
