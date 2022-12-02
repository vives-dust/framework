import { default as feathers, HookContext } from '@feathersjs/feathers';
import * as Validation from '../../hooks/validation';
import { generate_nanoid } from '../../hooks/nanoid';
import { ConversionModelSchemas } from '../../validation/conversionmodel';


export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [generate_nanoid, Validation.input(ConversionModelSchemas._create) ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
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
