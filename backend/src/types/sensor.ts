export interface Sensor {
  _id?: string,                     // Mongo ID
  id?: string,                      // NanoID
  name: string,
  device_id: string,                // Mongo ID to device the sensor belongs to
  sensortype_id: string,            // Mongo ID to the type of sensor
  meta: {
    depth?: number,
    conversion_model_id?: string,   // Mongo ID to the conversion model to use
  },
  data_source: {
    source: string,           // Example: influxdb
    bucket: string,           // Example: dust
    measurement: string,      // Example: dust-sensor
    tags: Object,             // Used for filtering. For dust device it is { "devId": "eui-xxxx" }, but other devices may have other identifiers
    field: string,            // Example: internalTemperature
  }
};
