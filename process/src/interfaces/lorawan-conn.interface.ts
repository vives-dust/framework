import { Point } from '@influxdata/influxdb-client'
export interface LoRaWAN {
  dev_id: string,
  hardwareSerial: string,
  time: string,
  frequency: number,
  airtime: number,
  rssi: number,
  snr: number,
  spreadFactor: number,
  counter: number,
  gateways: number,
}

export default function processConnectionData(input :any) :LoRaWAN {
  return {
      dev_id: input.end_device_ids.device_id,
      hardwareSerial: input.end_device_ids.dev_eui,
      time: input.received_at,
      frequency: input.uplink_message.settings.frequency,
      airtime: (input.uplink_message.consumed_airtime).replace('s', ''),
      rssi: getBestRssi(input.uplink_message.rx_metadata),
      snr: getBestSnr(input.uplink_message.rx_metadata),
      spreadFactor: input.uplink_message.settings.data_rate.lora.spreading_factor,
      counter: input.uplink_message.f_cnt,
      gateways: input.uplink_message.rx_metadata.filter( (g :any) => g.gateway_id !== "packetbroker").length
  }
}

export const addLoRaWANData = (point :Point, data :LoRaWAN): Point => {
  point
    .tag( "devId", data.dev_id )
    .tag( "hardwareSerial", data.hardwareSerial )
    .timestamp( Date.parse(data.time))
    .intField( "frequency", data.frequency)
    .floatField( "airtime", data.airtime)
    .floatField( "rssi", data.rssi)
    .floatField( "snr", data.snr)
    .intField( "spreadFactor", data.spreadFactor)
    .intField( "counter", data.counter)
    .intField( "gateways", data.gateways)
  return point
}

function getBestRssi(gateways :any) :number{
  const rssis = gateways.map( (gateway :any) => gateway.rssi)
  .filter( (rssi :any) => rssi !== undefined)
  return Math.max(...rssis)
}

function getBestSnr(gateways :any) :number{
  const snrs = gateways.map( (gateway : any) => gateway.snr)
  .filter( (snr :any) => snr !== undefined)
  return Math.max(...snrs)
}