let loc = {
    latitude: 48.473135,
    longitude: 35.0236013,
    isGet: false,
    lang: navigator.language || 'uk-UA',
}

const dom = {
    bigWeather: document.querySelector('.big-weather'),
    blockDays: document.querySelectorAll('.block-days'),
    modal: document.querySelector('.modal'),
}

const weather = {
    data: {},
    current: {},
    cards: [],
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getCoords, error);
} else {
    error({
        message: 'browser not support navigator.geolocation'
    })
}

function error(err) {
    console.log(err.message);
    return getWeather(loc);
}

function getCoords({
    coords
}) {
    loc.isGet = true;
    loc.latitude = coords.latitude;
    loc.longitude = coords.longitude;
    getWeather(loc);
    getCurrentWeather(loc);
    return;
}

function tr(){
    const body = JSON.stringify({password:"testtest", email:"email@mail.com"});
    fetch('https://melytix.herokuapp.com/registration/',{
      method: "POST",
      headers:{"Content-Type":"application/json;charset=utf-8"},
      body: body
    })
      .then(res => {
        console.log(res.status);
        return res.json();
      })
      .then(data => {
        console.log(data);
        return data;
      });
}

function getWeather({
    latitude,
    longitude
}) {
    fetch(`https://api.weather.com/v1/geocode/${latitude}/${longitude}/forecast/daily/5day.json?units=m&language=${loc.lang}&apiKey=320c9252a6e642f38c9252a6e682f3c6`)
        .then(response => response.json())
        .then(data => {
            weather.data = {
                ...data
            };
            showOtherWeather(data);
        });
}

function getCurrentWeather({
    latitude,
    longitude
}) {
    fetch(`https://api.weather.com/v3/wx/observations/current?geocode=${latitude}%2C${longitude}&units=m&language=${loc.lang}&format=json&apiKey=320c9252a6e642f38c9252a6e682f3c6`)
        .then(response => response.json())
        .then(data => {
            weather.current = {
                ...data
            };
            showBigWeather(data);
        });
}

function showBigWeather(w) {
    // Для определения города - планируется использование Google maps API -
    //     let latlng = new google.maps.LatLng(loc.latitude, loc.longitude); 
    // new google.maps.Geocoder().geocode({'latLng' : latlng}, function(results, status) {
    //     if (status == google.maps.GeocoderStatus.OK) {
    //         if (results[1]) {
    //             var country = null, countryCode = null, city = null, cityAlt = null;
    //             var c, lc, component;
    //             for (var r = 0, rl = results.length; r < rl; r += 1) {
    //                 var result = results[r];

    //                 if (!city && result.types[0] === 'locality') {
    //                     for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
    //                         component = result.address_components[c];

    //                         if (component.types[0] === 'locality') {
    //                             city = component.long_name;
    //                             break;
    //                         }
    //                     }
    //                 }
    //                 else if (!city && !cityAlt && result.types[0] === 'administrative_area_level_1') {
    //                     for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
    //                         component = result.address_components[c];

    //                         if (component.types[0] === 'administrative_area_level_1') {
    //                             cityAlt = component.long_name;
    //                             break;
    //                         }
    //                     }
    //                 } else if (!country && result.types[0] === 'country') {
    //                     country = result.address_components[0].long_name;
    //                     countryCode = result.address_components[0].short_name;
    //                 }

    //                 if (city && country) {
    //                     break;
    //                 }
    //             }

    //             console.log("City: " + city + ", City2: " + cityAlt + ", Country: " + country + ", Country Code: " + countryCode);
    //         }
    //     }
    // });
    console.log(w)
    dom.bigWeather.innerHTML = `<div class='header-big-card'><span>Lat: <small>${loc.latitude}</small> Long: <small>${loc.longitude}</small></span><span>${w.dayOfWeek}</span><span>${new Date(w.validTimeLocal).toLocaleString()}</span></div>
    <div class="block-main-big-card">
    <div class='icon-big-card' style="background-image:url(https://doc.media.weather.com/products/icons/${w.iconCode}.png">
    <span>${w.cloudCoverPhrase}</span>
    </div>
    <div class='temp-big-card'>${w.temperature}C&deg;</div>
    <div class="other-info-big-card">
    <span><b>Wind:</b> ${w.windSpeed}kph</span>
    <span><b>Wind direction:</b> ${w.windDirectionCardinal}</span>
    <span><b>Precip:</b> ${w.precip1Hour} mm</span>
    <span><b>Pressure:</b> ${w.pressureAltimeter} mb</span>
    <span><b>Temperature feels like:</b> ${w.temperatureFeelsLike}C&deg;</span>
    <span><b>Sunrise:</b> ${new Date(w.sunriseTimeLocal).toLocaleString()}</span>
    <span><b>Sunset:</b> ${new Date(w.sunsetTimeLocal).toLocaleString()}</span>
    </div>
    </div>
    `
}

function showOtherWeather(w) {
    let nW = w.forecasts.slice(1);
    weather.cards = w.forecasts.slice(1);
    nW.map((el, i) => {
        let date = new Date(el.fcst_valid_local);
        let temp = el.max_temp;
        let nTemp = el.min_temp;
        dom.blockDays[i].dataset.id = i;
        dom.blockDays[i].innerHTML = `<h4 data-id='${i}'>${el.dow}</h4>
        <span data-id='${i}'>${date.toLocaleDateString()}</span>
        <div class="icon-small-card" data-id='${i}' style="background-image: url(https://doc.media.weather.com/products/icons/${el.day.icon_code}.png);"></div>
        <span class="temp-small-card" data-id='${i}'>${temp}C&deg; - ${nTemp}C&deg;</span>
        `
    });

}

dom.blockDays.forEach((ev) => {
    ev.addEventListener('click', showWeather);
});

function showWeather(ev) {
    let card = weather.cards[ev.target.dataset.id];
    dom.modal.addEventListener('click', hideModal);
    dom.modal.classList.add('modal-active');
    dom.modal.innerHTML = `
    <div class="modal-card">
    <div class='header-big-card'><span>Lat: <small>${loc.latitude}</small> Long: <small>${loc.longitude}</small></span><span>${card.dow}</span></div>
    <div class="block-main-big-card">
    <div class='icon-big-card' style="background-image:url(https://doc.media.weather.com/products/icons/${card.day.icon_code}.png"></div>
    <div class='temp-big-card'><span>Min: ${card.min_temp}C&deg;</span><span>Max: ${card.max_temp}C&deg;</span></div>
    <div class="other-info-big-card">
    <span><b>Lunar phase:</b> ${card.lunar_phase}</span>
    <span><b>Sunrise:</b> ${new Date(card.sunrise).toLocaleString()}</span>
    <span><b>Sunset:</b> ${new Date(card.sunset).toLocaleString()}</span>
    <span><b>${card.narrative}</b></span>
    </div>
    </div>`
}

function hideModal() {
    dom.modal.innerHTML = '';
    dom.modal.classList.remove('modal-active');
}

tr();
