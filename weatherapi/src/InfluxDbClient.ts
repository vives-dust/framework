import {InfluxDB, Point, HttpError} from '@influxdata/influxdb-client'
import { WriteApi } from '@influxdata/influxdb-client'
import  { WeatherInfo }  from './WeatherApi'

interface Options {
  host?: string
  port?: number
  bucket?: string
  org?: string
  token?: string
}

export default class InfluxDbClient {

  influxdb: WriteApi

  public constructor(options :Options = {}) {
    const { host = 'localhost', port = 8086, org = "default", bucket = "default", token = "" } = options
    this.influxdb = new InfluxDB( { url: `http://${host}:${port}`, token}).getWriteApi(org, bucket)
  }

  public save( data: any) {
    console.log('Saving to influxdb')
    data.forEach( (item :WeatherInfo) => {
      const point = new Point("weatherapi").tag( "location", item.location).timestamp(item.timestamp)
        .floatField( "temperature", item.temperature)
        .floatField( "windspeed", item.windspeed)
        .floatField( "pressure", item.pressure)
        .floatField( "rain", item.rain)
        .floatField( "clouds", item.clouds)
        .floatField( "humidity", item.humidity)
      this.influxdb.writePoint(point)
      console.log(point)
    });
    this.influxdb.flush().catch( (error) => console.log(error) )
  }

  public close() {
  }

}