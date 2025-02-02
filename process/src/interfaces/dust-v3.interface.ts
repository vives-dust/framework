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
      .tag("devId", data.dev_id)
      .tag("hardwareSerial", data.hardwareSerial)
      .timestamp(Date.parse(data.time))
      .intField("frequency", data.frequency)
      .intField("moistureLevel_1", data.moistureLevel_1)
      .intField("moistureLevel_2", data.moistureLevel_2)
      .intField("moistureLevel_3", data.moistureLevel_3)
      .intField("moistureLevel_4", data.moistureLevel_4)
      .floatField("battery", data.battery)
      .floatField("internalTemperature", data.internalTemperature)
      .floatField("rssi", data.rssi)
      .intField("counter", data.counter)
      .intField("gateways", data.gateways)

    if(Number.isFinite(data.snr)){
      point.floatField("snr", data.snr)
    }

    if(data.airTemperature !== null){
      point.floatField("airTemperature", data.airTemperature)
    }

    if(data.soilTemperature !== null){
      point.floatField("soilTemperature", data.soilTemperature)
    }
    addLoRaWANData(point, data)

  return point
}