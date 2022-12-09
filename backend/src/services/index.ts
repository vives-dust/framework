import { Application } from '../declarations';
import users from './users/users.service';
import measurements from './measurements/measurements.service';
import sensors from './sensors/sensors.service';
import devices from './devices/devices.service';
import sensortypes from './sensortypes/sensortypes.service';
import devicetypes from './devicetypes/devicetypes.service';
import devicesensors from './devicesensors/devicesensors.service';
import trees from './trees/trees.service';
import conversionmodels from './conversionmodels/conversionmodels.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(measurements);
  app.configure(sensors);
  app.configure(devices);
  app.configure(sensortypes);
  app.configure(devicetypes);
  app.configure(devicesensors);
  app.configure(trees);
  app.configure(conversionmodels);
}
