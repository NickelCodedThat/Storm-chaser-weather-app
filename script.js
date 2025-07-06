const apiKey = "c5f7a3cfec514c6cb0b25931250307";
const app = document.querySelector(".weather-app");
const temp = document.querySelector(".temp");
const dateOuput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const conditionOutput = document.querySelector(".condition");
const nameOutput = document.querySelector(".name");
const icon = document.querySelector(".icon");
const cloudOutput = document.querySelector(".cloud");
const humidityOutput = document.querySelector(".humidity");
const windOutput = document.querySelector(".wind");
const form = document.querySelector("#locationInput");
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const cities = document.querySelectorAll(".city");
const feelslikeOutput = document.querySelector(".feelslike");
const uvOutput = document.querySelector(".uv");
const visibilityOutput = document.querySelector(".visibility");
const precipOutput = document.querySelector(".precip");
const sunriseOutput = document.querySelector(".sunrise");
const sunsetOutput = document.querySelector(".sunset");

let cityInput = "New York";

cities.forEach((city) => {
city.addEventListener("click", (e) => {
cityInput = e.target.innerHTML;
fetchWeatherData();
app.style.opacity = "0";
})
})

form.addEventListener("submit", (e) => {
if (search.value.length == 0) {
alert("Please type in a city name")
} else {
cityInput = search.value;
fetchWeatherData();
search.value = "";
app.style.opacity = "0";
}
e.preventDefault();
})

function dayofTheWeek(day, month, year) {
const weekday = [
"Sunday",
"Monday",
"Tuesday",
"Wednesday",
"Thursday",
"Friday",
"Saturday"
];
return weekday[new Date(`${day}/${month}/${year}`).getDay()];
}
   function fetchWeatherData() {
  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityInput}&days=3&aqi=no&alerts=no`)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      // Current conditions
      temp.innerHTML = `${data.current.temp_f}&#176;F`;
      conditionOutput.innerHTML = data.current.condition.text;
      nameOutput.innerHTML = data.location.name;
      icon.src = "https:" + data.current.condition.icon;

      const date = data.location.localtime;
      const y = parseInt(date.substr(0, 4));
      const m = parseInt(date.substr(5, 2));
      const d = parseInt(date.substr(8, 2));
      const time = date.substr(11);
      dateOuput.innerHTML = `${dayofTheWeek(m, d, y)} ${m}/${d}/${y}`;
      timeOutput.innerHTML = time;

      // Weather details
      cloudOutput.innerHTML = `${data.current.cloud}% Cloudiness`;
      humidityOutput.innerHTML = `${data.current.humidity}%`;
      windOutput.innerHTML = `${data.current.wind_mph} mph`;
      feelslikeOutput.innerHTML = `${data.current.feelslike_f}°F`;
      uvOutput.innerHTML = data.current.uv;
      visibilityOutput.innerHTML = `${data.current.vis_miles} mi`;
      precipOutput.innerHTML = `${data.current.precip_in} in`;

      // Astro
      const sunrise = data.forecast.forecastday[0].astro.sunrise;
      const sunset = data.forecast.forecastday[0].astro.sunset;
      sunriseOutput.innerHTML = sunrise;
      sunsetOutput.innerHTML = sunset;

      // Day/night visual slider
      const currentTime = new Date(data.location.localtime);
      const sunriseTime = new Date(`${data.location.localtime.split(" ")[0]} ${sunrise}`);
      const sunsetTime = new Date(`${data.location.localtime.split(" ")[0]} ${sunset}`);

      let percentOfDay = 0;
      if (currentTime < sunriseTime) percentOfDay = 0;
      else if (currentTime > sunsetTime) percentOfDay = 1;
      else {
        const duration = sunsetTime - sunriseTime;
        const elapsed = currentTime - sunriseTime;
        percentOfDay = elapsed / duration;
      }

      // Background
      const timeofDay = data.current.is_day ? "day" : "night";
      const code = data.current.condition.code;

      if (code === 1000) {
        app.style.backgroundImage = `url(./images/${timeofDay}/clear.jpg)`;
        btn.style.background = timeofDay === "night" ? "#181e27" : "#e5ba92";
      } else if ([1003, 1006, 1009, 1030, 1069, 1087, 1135, 1273, 1276, 1279, 1287].includes(code)) {
        app.style.backgroundImage = `url(./images/${timeofDay}/cloudy.jpg)`;
        btn.style.background = timeofDay === "night" ? "#181e27" : "#fa6d1d";
      } else if ([1063, 1069, 1072, 1150, 1153, 1180, 1183, 1189, 1192, 1195, 1204, 1207, 1240, 1243, 1246, 1249, 1252].includes(code)) {
        app.style.backgroundImage = `url(./images/${timeofDay}/rainy.jpg)`;
        btn.style.background = timeofDay === "night" ? "#325c80" : "#647d75";
      } else {
        app.style.backgroundImage = `url(./images/${timeofDay}/snowy.jpg)`;
        btn.style.background = timeofDay === "night" ? "#1b1b1b" : "#4d72aa";
      }

      app.style.opacity = "1";
    })
    .catch(err => {
      alert("City not found, please try again");
      app.style.opacity = "1";
      console.error(err);
    });
} 

document.addEventListener("DOMContentLoaded",() => { fetchWeatherData();
});