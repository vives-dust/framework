import processConnectionData from "./lorawan-conn.interface";

interface SapFlowISF {
  alpha_inner: number,
  alpha_outer: number,
  beta_inner: number,
  beta_outer: number,
  heat_velocity_inner: number,
  heat_velocity_outer: number,
  max_voltage: number,
  min_voltage: number,
  sap_flow: number,
  temperature_outer: number,
  tmax_inner: number,
  tmax_outer: number,
  upstream_tmax_inner: number,
  upstream_tmax_outer: number,
  battery: number,
  device_id: string,
  protocol_version: number,
  diagnostic: number,
  dev_id: string,
  hardwareSerial: string,
}

export default function processISFData(input :any) :SapFlowISF {
  return {
      alpha_inner: input.uplink_message.decoded_payload.alpha_inner,
      alpha_outer: input.uplink_message.decoded_payload.alpha_outer,
      beta_inner: input.uplink_message.decoded_payload.beta_inner,
      beta_outer: input.uplink_message.decoded_payload.beta_outer,
      heat_velocity_inner: input.uplink_message.decoded_payload.heat_velocity_inner,
      heat_velocity_outer: input.uplink_message.decoded_payload.heat_velocity_outer,
      max_voltage: input.uplink_message.decoded_payload.max_voltage,
      min_voltage: input.uplink_message.decoded_payload.min_voltage,
      sap_flow: input.uplink_message.decoded_payload.sap_flow,
      temperature_outer: input.uplink_message.decoded_payload.temperature_outer,
      tmax_inner: input.uplink_message.decoded_payload.tmax_inner,
      tmax_outer: input.uplink_message.decoded_payload.tmax_outer,
      upstream_tmax_inner: input.uplink_message.decoded_payload.upstream_tmax_inner,
      upstream_tmax_outer: input.uplink_message.decoded_payload.upstream_tmax_outer,
      battery: input.uplink_message.decoded_payload.battery,
      device_id: input.uplink_message.decoded_payload.device_id,
      protocol_version: input.uplink_message.decoded_payload.protocol_version,
      diagnostic: input.uplink_message.decoded_payload.diagnostic,
      dev_id: input.end_device_ids.device_id,
      hardwareSerial: input.end_device_ids.dev_eui,
      ...processConnectionData(input)
  }
}