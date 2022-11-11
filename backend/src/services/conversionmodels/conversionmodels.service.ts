// Initializes the `conversionmodels` service on path `/conversionmodels`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Conversionmodels } from './conversionmodels.class';
import createModel from '../../models/conversionmodels.model';
import hooks from './conversionmodels.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'conversionmodels': Conversionmodels & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/conversionmodels', new Conversionmodels(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('conversionmodels');

  service.hooks(hooks);
}
