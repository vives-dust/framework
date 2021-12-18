import { InfluxDB } from 'influx'
import  { WeatherInfo }  from './WeatherApi'

interface Options {
  host?: string
  port?: number
  database?: string
}

export default class InfluxDbClient {

  influxdb: InfluxDB

  public constructor(options :Options = {}) {
    const { host, port, database = 'default' } = options
    this.influxdb = new InfluxDB({ host, port, database })
    console.log('******** create database: ', database)
    this.influxdb.createDatabase(database)
  }

  public save( data: any) {
    console.log('Saving to influxdb')
    data.forEach( (item :WeatherInfo) => {
      this.influxdb.writeMeasurement('weatherapi', [{
        tags: {
          location: item.location
        },
        fields: { 
          temperature: item.temperature,
          windspeed: item.windspeed,
          pressure: item.pressure,
          rain: item.rain,
          clouds: item.clouds,
          humidity: item.humidity
        },
        timestamp: item.timestamp
      }])  
    });
  }

  public close() {
  }

}