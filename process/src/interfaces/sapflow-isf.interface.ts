import processConnectionData, { LoRaWAN, addLoRaWANData } from "./lorawan-conn.interface";
import {Point} from '@influxdata/influxdb-client'

interface SapFlowISF extends LoRaWAN{
  alphaInner: number,
  alphaOuter: number,
  betaInner: number,
  betaOuter: number,
  heatVelocityInner: number,
  heatVelocityOuter: number,
  maxVoltage: number,
  minVoltage: number,
  sapFlow: number,
  temperatureOuter: number,
  tmaxInner: number,
  tmaxOuter: number,
  upstreamTmaxInner: number,
  upstreamTmaxOuter: number,
  battery: number,
  device_id: string,
  protocol_version: number,
  diagnostic: number,
}

export default function processISFData(input :any) :SapFlowISF {
  return {
      alphaInner: input.uplink_message.decoded_payload.alpha_inner.value,
      alphaOuter: input.uplink_message.decoded_payload.alpha_outer.value,
      betaInner: input.uplink_message.decoded_payload.beta_inner.value,
      betaOuter: input.uplink_message.decoded_payload.beta_outer.value,
      heatVelocityInner: input.uplink_message.decoded_payload.heat_velocity_inner.value,
      heatVelocityOuter: input.uplink_message.decoded_payload.heat_velocity_outer.value,
      maxVoltage: input.uplink_message.decoded_payload.max_voltage.value,
      minVoltage: input.uplink_message.decoded_payload.min_voltage.value,
      sapFlow: input.uplink_message.decoded_payload.sap_flow.value,
      temperatureOuter: input.uplink_message.decoded_payload.temperature_outer.value,
      tmaxInner: input.uplink_message.decoded_payload.tmax_inner.value,
      tmaxOuter: input.uplink_message.decoded_payload.tmax_outer.value,
      upstreamTmaxInner: input.uplink_message.decoded_payload.upstream_tmax_inner.value,
      upstreamTmaxOuter: input.uplink_message.decoded_payload.upstream_tmax_outer.value,
      battery: input.uplink_message.decoded_payload.battery_voltage.value,
      device_id: input.uplink_message.decoded_payload.device_id,
      protocol_version: input.uplink_message.decoded_payload.protocol_version,
      diagnostic: input.uplink_message.decoded_payload.diagnostic.value,
      ...processConnectionData(input)
  }
}

export function saveISFData(data :any) {
  const point = new Point("sapflow-sensor")
    .tag( "protocol_version", data.protocol_version)
    .tag( "diagnostic", data.diagnostic)
    .timestamp( Date.parse(data.time))
    .floatField( "alphaInner", data.alphaInner)
    .floatField( "alphaOuter", data.alphaOuter)
    .floatField( "betaInner", data.betaInner)
    .floatField( "betaOuter", data.betaOuter)
    .floatField( "heatVelocityInner", data.heatVelocityInner)
    .floatField( "heatVelocityOuter", data.heatVelocityOuter)
    .floatField( "maxVoltage", data.maxVoltage)
    .floatField( "minVoltage", data.minVoltage)
    .floatField( "sapFlow", data.sapFlow)
    .floatField( "temperatureOuter", data.temperatureOuter)
    .floatField( "tmaxInner", data.tmaxInner)
    .floatField( "tmaxOuter", data.tmaxOuter)
    .floatField( "upstreamTmaxInner", data.upstreamTmaxInner)
    .floatField( "upstreamTmaxOuter", data.upstreamTmaxOuter)
    .floatField( "battery", data.battery)
  addLoRaWANData(point, data)

  return point
}