import { Application } from '../declarations';
import users from './users/users.service';
import sensors from './sensors/sensors.service';
import moisture from './moisture/moisture.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(sensors);
  app.configure(moisture);
}
