import { InfluxDB } from 'influx'

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
    console.log('data', data)
    this.influxdb.writeMeasurement('tph', [{
      tags: {
        dataRate: data.dataRate,
        codingRate: data.codingRate,
        devId: data.dev_id,
        hardwareSerial: data.hardwareSerial
      },
      fields: { 
        frequency: data.frequency,
        temperature: data.temperature,
        humidity: data.humidity,
        pressure: data.pressure,
        battery: data.battery,
        time: data.time,
        rssi: data.rssi,
        snr: data.snr,
        counter: data.counter,
        gateways: data.gateways
      }
    }])
  }

  public close() {
  }

}