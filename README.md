# 06WeatherDashboard

Week 6 Homework for UCLA Extension - Full Stack Web Development

Utilizing what we've learned about API integrations & calls to create a Weather app to show Current Day and a 5 Day forecast.

##Tech/Framework Used
Built with Jquery, FontAwesome, and OpenWeatherMap API.

##How To Use?
When opening up the page, if a previous search was made, the last search value will be gotten from local storage.

Search for a City to populate the current date, temperature, humidity, windspeed, and UV-Index. UV-Index will show green/yellow/orange/red, depending on UV severity.

After search, the search value will be stored in the search history which can be clicked again to run a new search. Last search is stored on Local Storage.

After search, a 5 day forecast is then shown.

## Credit/API Reference

Open Weather Map APIs:
https://openweathermap.org/current
https://openweathermap.org/forecast5

To convert the UTC timestamp provided by Open Weather Map, I used https://www.epochconverter.com/.
