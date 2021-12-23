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
        codingRate: data.codingRate,
        devId: data.dev_id,
        hardwareSerial: data.hardwareSerial
      },
      fields: { 
        frequency: data.frequency,
        moistureLevel_1: data.moistureLevel_1,
        moistureLevel_2: data.moistureLevel_2,
        moistureLevel_3: data.moistureLevel_3,
        moistureLevel_4: data.moistureLevel_4,
        battery: data.battery,
        internalTemperature: data.internalTemperature,
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