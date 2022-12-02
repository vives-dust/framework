// Initializes the `devicesensors` service on path `/devicesensors`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Devicesensors } from './devicesensors.class';
import createModel from '../../models/devicesensors.model';
import hooks from './devicesensors.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'devicesensors': Devicesensors & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: [ '$populate' ],
  };

  // Initialize our service with any options it requires
  app.use('/devicesensors', new Devicesensors(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('devicesensors');

  service.hooks(hooks);
}
