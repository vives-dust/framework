export interface Device {
  _id?: string,                 // Mongo ID
  id?: string,                  // NanoID
  name: string,
  description: string,
  hardware_id?: string,         // Hardware ID is a hardware specific ID. For example for DUST devices it is a serial number
  devicetype_id: string,        // Mongo ID to the actual device type
  tree_id: string,              // Mongo ID to the actual tree it belongs to
  datasource_key: string,       // The key identification of the device in the data source. For example for DUST device this is EUI
};