import * as Validation from '../../hooks/validation';
import { generate_nanoid } from '../../hooks/nanoid';
import { ConversionModelSchemas } from '../../validation/conversionmodel';
import { iffElse, isProvider } from 'feathers-hooks-common';
import * as ConversionModelsMiddleware from './conversionmodels.middleware';

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */
          generate_nanoid, 
          Validation.input(ConversionModelSchemas._create)
        ],
        [ /* hooks for internal requests */ ],
      ),
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */
          ConversionModelsMiddleware.sanitize_create_conversionmodel, 
          Validation.dispatch(ConversionModelSchemas._created)
        ],
        [ /* hooks for internal requests */ ],
      ),
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
