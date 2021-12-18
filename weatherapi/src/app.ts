import InfluxDB from './InfluxDbClient'
import WeatherApi from './WeatherApi';

const influxdb = new InfluxDB({
    host: process.env.INFLUXDB_HOST,
    port: process.env.INFLUXDB_PORT ? parseInt(<string>process.env.INFLUXDB_PORT) : undefined,
    database: process.env.INFLUXDB_DB
});

if( !process.env.API_KEY ){
    console.error("No API_KEY is set")
    process.exit(1)
}

const locations: string[] = JSON.parse(process.env.LOCATIONS || '["Brugge"]')
const apiKey: string = process.env.API_KEY
const interval: number = process.env.INTERVAL ? parseInt(<string>process.env.INTERVAL) : 15

const weatherApi = new WeatherApi(locations, apiKey)

console.log('Weatherapi ready...')

const fetchData = async () => {
    const result = await weatherApi.getCurrentWeather()
    influxdb.save(result)
    console.log(result)
}

fetchData()
setInterval(fetchData, interval * 1000 * 60)


process.on('SIGTERM', () => {
    console.log("Stopping weatherapi")
});

