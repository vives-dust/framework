import processConnectionData, { LoRaWAN, addLoRaWANData } from "./lorawan-conn.interface";
import {Point} from '@influxdata/influxdb-client'

interface DraginoDiver extends LoRaWAN{
    battery: number,
    waterLevel: number,
    status: boolean,
}

export default function processDiverData(input :any) :SapFlowISF {
  return {
        battery: input.uplink_message.decoded_payload.Bat_V,
        waterLevel: input.uplink_message.decoded_payload.Water_deep_cm,
        status: input.uplink_message.decoded_payload.Exti_status,
      ...processConnectionData(input)
  }
}

export function saveDiverData(data :any) {
  const point = new Point("sapflow-sensor")
    .tag( "protocol_version", data.protocol_version)
    .tag( "diagnostic", data.diagnostic)
    .tag( "device_id", data.device_id)
    .timestamp( Date.parse(data.time))
    .floatField("battery", data.battery)
    .floatField("waterLevel", data.waterLevel)
    .booleanField("status", data.status)
  addLoRaWANData(point, data)

  return point
}