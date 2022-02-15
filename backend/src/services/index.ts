import { Application } from '../declarations';
import users from './users/users.service';
import sensors from './sensors/sensors.service';
import measurements from './measurements/measurements.service';
import soilmodels from './soilmodels/soilmodels.service';
import devices from './devices/devices.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(sensors);
  app.configure(measurements);
  app.configure(soilmodels);
  app.configure(devices);
}
