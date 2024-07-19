import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useWeatherStore = defineStore('weather', () => {

    const cityId = ref('');

    // onMounted(() => {fetchWeatherData() });
    // 获取天气建议的函数
    // const cityId = ref('');
    const latLon = ref('');
    const city = ref('');
    const weather = ref('');//天气状况
    const detailedWeather = ref('');
    const gentleReminder = ref('');
    const sunny = ref(false)//晴天
    const cloudy = ref(false)//多云
    const overcast = ref(false)//阴天
    const strong_wind = ref(false)//大风
    const rain = ref(false)//雨
    const snow = ref(false)//雪
    const key = 'a315f76db06144a6925066a112f0e97c';//和风天气API密钥
    const gdkey = '38fb91ebb42b90813c5dfaaa0b5c5aad';//高德API密钥

    async function fetchWeatherData() {

        //天气全关闭
        sunny.value = false
        cloudy.value = false
        strong_wind.value = false
        overcast.value = false
        rain.value = false
        snow.value = false

        try {
            //获取位置信息(高德)
            const positionResponse = await axios.get(`https://restapi.amap.com/v3/ip?json=xml&key=${gdkey}`);
            console.log(positionResponse.data);
            city.value = positionResponse.data.city;

            //获取天气信息(高德)
            // const weatherResponse = await axios.get(`https://restapi.amap.com/v3/weather/weatherInfo?city=450200&key=38fb91ebb42b90813c5dfaaa0b5c5aad`);
            // weather.value = weatherResponse.data.lives[0]
            // console.log(weatherResponse.data.lives[0]);

            // // 获取IP地址相关信息(ip以及城市)
            // const ipResponse = await axios.get('http://ip-api.com/json/');
            // latLon.value = ipResponse.data.lat.toFixed(2) + ',' + ipResponse.data.lon.toFixed(2);
            // city.value = ipResponse.data.city;
            // console.log(ipResponse.data);

            // //获取ip地址(单独IP)
            // const ipResponse = await axios.get('https://ip.weatherwidget.org/');
            // latLon.value = ipResponse.data
            // console.log(latLon.value);

            // 获取城市ID(和风天气)
            const cityResponse = await axios.get(`https://geoapi.qweather.com/v2/city/lookup?location=${positionResponse.data.city}&key=${key}`);
            cityId.value = cityResponse.data.location[0].id;
            // console.log(cityId.value);

            // 获取当天天气信息(和风天气)
            const weatherResponse = await axios.get(`https://devapi.qweather.com/v7/weather/now?location=${cityId.value}&key=${key}`);
            weather.value = weatherResponse.data.now;
            detailedWeather.value = weatherResponse.data.fxLink
            // console.log(weatherResponse.data);
        } catch (error) {
            console.log(error);
        }
        function getWeatherAdvice(weatherDescription, temperature) {
            let reminder = "";

            if (weatherDescription.includes("晴")) {
                reminder = "天气很好，出去走走吧！";
                sunny.value = true
            } else if (weatherDescription.includes("雨")) {
                reminder = "今天有雨，出门戴好雨具，出门前记得带伞！";
                rain.value = true
            } else if (weatherDescription.includes("雪")) {
                reminder = "今天有雪，出门戴好雪套，出门前记得带伞！";
                snow.value = true
            } else if (weatherDescription.includes("阴")) {
                reminder = "天气不错，出门前记得穿好衣服，出门前记得带伞！";
                cloudy.value = true
            }else if(weatherDescription.includes("云")) {
                reminder = "天气不错，出门前记得穿好衣服，出门前记得带伞！";
                overcast.value = true
            }else if (weatherDescription.includes("风")) {
                reminder = "今天有风，注意防风，出门前穿好防风衣物！";
                strong_wind.value = true
            } else if (weatherDescription.includes("雾")) {
                reminder = "今天有雾，注意行车安全，能见度低小心驾驶！";
            } else if (weatherDescription.includes("雷")) {
                reminder = "今天有雷，注意雷电，避免在户外活动！";
            } else {
                reminder = "天气变幻莫测，出门前记得做好准备，随时注意安全！";
            }

            if (temperature > 30) {
                reminder += " 天气很热，注意防晒，多喝水！";
            } else if (temperature <= 30 && temperature > 20) {
                reminder += " 气温适中，注意天气变化！";
            } else if (temperature <= 20 && temperature > 10) {
                reminder += " 气温较凉，注意保暖！";
            } else if (temperature <= 10) {
                reminder += " 天气很冷，注意防寒，穿好厚衣服！";
            }
            gentleReminder.value = reminder;
        }
        getWeatherAdvice(weather.value.text, weather.value.temp);//和风天气
        // getWeatherAdvice(weather.value.weather, weather.value.temperature);//高德天气

    }

    // 调用异步函数
    fetchWeatherData();
    // 每隔10分钟调用一次
    setInterval(() => {
        fetchWeatherData();
    }, 600000);

    return {
        cityId,
        latLon,
        city,
        weather,
        detailedWeather,
        gentleReminder,
        fetchWeatherData,
        sunny,
        cloudy,
        overcast,
        strong_wind,
        rain,
        snow
    };
});
