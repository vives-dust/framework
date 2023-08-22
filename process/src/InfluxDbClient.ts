import {InfluxDB, Point, WriteApi} from '@influxdata/influxdb-client'

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
    this.influxdb = new InfluxDB( { url: `http://${host}:${port}`, token}).getWriteApi(org, bucket, 'ms')
  }

  public save( point :Point) {
    this.influxdb.writePoint(point)
    console.log(point)

    this.influxdb.flush().catch( (error) => console.log(error) )
  }

  public close() {
  }

}