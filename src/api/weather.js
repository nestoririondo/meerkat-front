import axios from "axios";
const KEY = import.meta.env.VITE_WEATHER_API_KEY;

export const getWeatherData = async (lat,lng,date,hour,setWeatherData) => {
    try {
        const response = await axios.get(
          `https://api.weatherapi.com/v1/forecast.json?key=${KEY}&q=${lat},${lng}&dt=${date}&hour=${hour}`
        );
        setWeatherData(response.data);
      } catch (error) {
        console.error(error);
      }
}