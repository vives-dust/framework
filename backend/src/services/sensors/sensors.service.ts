// Initializes the `sensors` service on path `/sensors`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Sensors } from './sensors.class';
import createModel from '../../models/sensors.model';
import hooks from './sensors.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'sensors': Sensors & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: [ '$populate' ],
  };

  // Initialize our service with any options it requires
  app.use('/sensors', new Sensors(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('sensors');

  service.hooks(hooks);
}
