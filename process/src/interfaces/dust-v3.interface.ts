import processConnectionData from "./lorawan-conn.interface";

interface DustV3SoilMoisture {
  moistureLevel_1: number,
  moistureLevel_2: number,
  moistureLevel_3: number,
  moistureLevel_4: number,
  battery: number,
  internalTemperature: number,
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
      dev_id: input.end_device_ids.device_id,
      hardwareSerial: input.end_device_ids.dev_eui,
      ...processConnectionData(input)
  }
}