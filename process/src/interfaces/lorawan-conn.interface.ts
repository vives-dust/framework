interface LoRaWAN {
  time: string,
  frequency: number,
  codingRate: string,
  airtime: number,
  rssi: number,
  snr: number,
  spreadFactor: number,
  counter: number,
  gateways: number,
}

export default function processConnectionData(input :any) :LoRaWAN {
  return {
      time: input.received_at,
      frequency: input.uplink_message.settings.frequency,
      codingRate: input.uplink_message.settings.coding_rate,
      airtime: (input.uplink_message.consumed_airtime).replace('s', ''),
      rssi: getBestRssi(input.uplink_message.rx_metadata),
      snr: getBestSnr(input.uplink_message.rx_metadata),
      spreadFactor: input.uplink_message.settings.data_rate.lora.spreading_factor,
      counter: input.uplink_message.f_cnt,
      gateways: input.uplink_message.rx_metadata.filter( (g :any) => g.gateway_id !== "packetbroker").length
  }
}

function getBestRssi(gateways :any) :number{
  const rssis = gateways.map( (gateway :any) => gateway.rssi)
  return Math.max(...rssis)
}

function getBestSnr(gateways :any) :number{
  const snrs = gateways.map( (gateway : any) => gateway.snr)
  return Math.max(...snrs)
}