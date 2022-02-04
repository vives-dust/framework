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

  public save( data: any) {
    console.log('data', data)

    const point = new Point("dust-sensor")
      .tag( "codingRate", data.codingRate )
      .tag( "devId", data.dev_id )
      .tag( "hardwareSerial", data.hardwareSerial )
      .timestamp( Date.parse(data.time))
      .intField( "frequency", data.frequency)
      .intField( "moistureLevel_1", data.moistureLevel_1)
      .intField( "moistureLevel_2", data.moistureLevel_2)
      .intField( "moistureLevel_3", data.moistureLevel_3)
      .intField( "moistureLevel_4", data.moistureLevel_4)
      .floatField( "battery", data.battery)
      .floatField( "internalTemperature", data.internalTemperature)
      .floatField( "rssi", data.rssi)
      .floatField( "snr", data.snr)
      .intField( "counter", data.counter)
      .intField( "gateways", data.gateways)
    this.influxdb.writePoint(point)
    console.log(point)

    this.influxdb.flush().catch( (error) => console.log(error) )
  }

  public close() {
  }

}