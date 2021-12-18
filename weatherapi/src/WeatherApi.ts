import axios, { AxiosResponse } from 'axios'

export interface WeatherInfo {
    location: string
    timestamp: Date
    temperature: number
    windspeed: number
    pressure: number
    rain: number
    clouds: number
    humidity: number
}

export default class WeatherApi {
    locations: string[]
    apiKey: string

    static url: string = 'http://api.weatherapi.com/v1/current.json'

    constructor(locations :string[], apiKey: string) {
        this.apiKey = apiKey
        this.locations = locations
    }

    async getCurrentWeather() :Promise<WeatherInfo[]> {
        return Promise.all( 
            this.locations.map( async (location: string) :Promise<WeatherInfo> => {
                const result = await this.fetchWeather(location)
                return result
            })
        )
    }

    async fetchWeather(location: string) :Promise<WeatherInfo> {
        console.log(`Fetching weather for '${location}'`)
        const url = `${WeatherApi.url}?key=${this.apiKey} &q=${location}`
        const result = await axios.get( url )
        return {
            location: result.data.location.name,
            timestamp: new Date(result.data.current.last_updated),
            temperature: result.data.current.temp_c,
            windspeed: result.data.current.wind_kph,
            pressure: result.data.current.pressure_mb,
            rain: result.data.current.precip_mm,
            clouds: result.data.current.cloud,
            humidity: result.data.current.humidity,
        }
    }
}