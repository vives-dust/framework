import type { SensorType } from "./sensortype";

export interface DeviceSensor {
  _id?: string,                     // Mongo ID

  devicetype_id: string,            // Mongo ID,
  sensortype_id: string,            // Mongo ID,

  data_source: {
    source: string,           // Example: influxdb
    bucket: string,           // Example: dust
    measurement: string,      // Example: dust-sensor
    tags: Object,             // Maps the specific tags in the datasource to a specific field. Example { "devId": "datasource_key" }
    field: string,            // Example: internalTemperature
  },
  meta: {
    depth?: number,
    conversion_model_id?: string,   // Mongo ID to the conversion model to use
  },
  
  // Possible joined objects
  sensortype?: SensorType
};
