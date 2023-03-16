// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type {
  ConversionModels,
  ConversionModelsData,
  ConversionModelsPatch,
  ConversionModelsQuery
} from './conversionmodels.schema'

export type { ConversionModels, ConversionModelsData, ConversionModelsPatch, ConversionModelsQuery }

export interface ConversionModelsParams extends MongoDBAdapterParams<ConversionModelsQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class ConversionModelsService<
  ServiceParams extends Params = ConversionModelsParams
> extends MongoDBService<
  ConversionModels,
  ConversionModelsData,
  ConversionModelsParams,
  ConversionModelsPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('conversionmodels'))
  }
}
