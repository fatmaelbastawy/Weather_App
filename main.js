function getWeather() {
    const apiKey = '29e3d2967c63489c8a5122242243009';  // ضع مفتاح WeatherAPI الخاص بك هنا
    const city = document.getElementById('city').value;


 

    if (!city) {
        alert('Please enter a city');
        return;
    }

    // URL الخاص بالحصول على الطقس الحالي
    const currentWeatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    // URL الخاص بالحصول على توقعات الساعات القادمة
    const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&hours=8`;

    // جلب بيانات الطقس الحالي
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        });

    // جلب بيانات التوقعات للساعات القادمة
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.forecast.forecastday[0].hour);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('city');
    const searchButton = document.getElementById('searchBtn');

    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchButton.click();
        }
    });
});


function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    tempDivInfo.innerHTML = "";
    weatherInfoDiv.innerHTML = "";

    if (data.error) {
        weatherInfoDiv.innerHTML = `<p>${data.error.message}</p>`;
    } else {
        const cityName = data.location.name;
        const temperature = Math.round(data.current.temp_c);
        const description = data.current.condition.text;
        const iconUrl = data.current.condition.icon; // جلب رابط الأيقونة من الـ API

        const temperatureHtml = `<p>${temperature}°C</p>`;
        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>`;

        tempDivInfo.innerHTML = temperatureHtml;
        weatherInfoDiv.innerHTML = weatherHtml;

        // إعداد الأيقونة
        weatherIcon.src = "https:" + iconUrl;
        weatherIcon.alt = description;
        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = "";  // إعادة تعيين المحتوى

    // تحديد الساعات المطلوبة
    const requiredHours = [20, 23, 2, 5, 8, 11, 14, 17];

    // تصفية الساعات من البيانات المستلمة
    const filteredHours = hourlyData.filter(item => {
        const hour = new Date(item.time).getHours();
        return requiredHours.includes(hour);
    });

    // عرض الساعات المطلوبة
    filteredHours.forEach(item => {
        const dateTime = new Date(item.time);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.temp_c);
        // تحقق من وجود URL الأساس للأيقونات
        const iconUrl = `https:${item.condition.icon}`; // استخدم https لربط الأيقونات بشكل صحيح

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>`;
        
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}
