import { Application } from '../declarations';
import users from './users/users.service';
import devices from './devices/devices.service';
import soilmodels from './soilmodels/soilmodels.service';
import measurements from './measurements/measurements.service';
import sensors from './sensors/sensors.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(devices);
  app.configure(soilmodels);
  app.configure(measurements);
  app.configure(sensors);
}
