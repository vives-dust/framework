// Initializes the `trees` service on path `/trees`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Trees } from './trees.class';
import createModel from '../../models/trees.model';
import hooks from './trees.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'trees': Trees & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/trees', new Trees(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('trees');

  service.hooks(hooks);
}
