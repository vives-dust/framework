import processConnectionData, { LoRaWAN, addLoRaWANData } from "./lorawan-conn.interface";
import { Point } from '@influxdata/influxdb-client'

interface DustV3SoilMoisture extends LoRaWAN{
  moistureLevel_1: number,
  moistureLevel_2: number,
  moistureLevel_3: number,
  moistureLevel_4: number,
  battery: number,
  internalTemperature: number,
  airTemperature: number,
  soilTemperature: number,
  dev_id: string,
  hardwareSerial: string,
}

export default function processDustData(input :any) :DustV3SoilMoisture {
  return {
      moistureLevel_1: input.uplink_message.decoded_payload.moistureLevel_1,
      moistureLevel_2: input.uplink_message.decoded_payload.moistureLevel_2,
      moistureLevel_3: input.uplink_message.decoded_payload.moistureLevel_3,
      moistureLevel_4: input.uplink_message.decoded_payload.moistureLevel_4,
      battery: input.uplink_message.decoded_payload.batteryVoltage,
      internalTemperature: input.uplink_message.decoded_payload.internalTemperature,
      airTemperature: input.uplink_message.decoded_payload.airTemperature,
      soilTemperature: input.uplink_message.decoded_payload.soilTemperature,
      ...processConnectionData(input)
  }
}

export function saveDustData(data :DustV3SoilMoisture) {
  const point = new Point("dust-sensor")
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
      .floatField( "airTemperature", data.airTemperature)
      .floatField( "soilTemperature", data.soilTemperature)
      .floatField( "rssi", data.rssi)
      .floatField( "snr", data.snr)
      .intField( "counter", data.counter)
      .intField( "gateways", data.gateways)
    addLoRaWANData(point, data)

  return point
}