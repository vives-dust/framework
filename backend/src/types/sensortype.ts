export interface SensorType {
  _id?: string,                     // Mongo ID
  type: string,
  name: string,
  description: string,
  unit: string,
};
