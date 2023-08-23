// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type {
  ConversionModel,
  ConversionModelData,
  ConversionModelPatch,
  ConversionModelQuery
} from './conversionmodels.schema'

export type { ConversionModel, ConversionModelData, ConversionModelPatch, ConversionModelQuery }

export interface ConversionModelParams extends MongoDBAdapterParams<ConversionModelQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class ConversionModelService<
  ServiceParams extends Params = ConversionModelParams
> extends MongoDBService<ConversionModel, ConversionModelData, ConversionModelParams, ConversionModelPatch> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('conversionmodels'))
  }
}
