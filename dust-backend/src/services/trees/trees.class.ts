// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Trees, TreesData, TreesPatch, TreesQuery } from './trees.schema'

export type { Trees, TreesData, TreesPatch, TreesQuery }

export interface TreesParams extends MongoDBAdapterParams<TreesQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class TreesService<ServiceParams extends Params = TreesParams> extends MongoDBService<
  Trees,
  TreesData,
  TreesParams,
  TreesPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('trees'))
  }
}
