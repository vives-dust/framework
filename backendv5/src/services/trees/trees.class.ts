// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Tree, TreeData, TreePatch, TreeQuery } from './trees.schema'

export type { Tree, TreeData, TreePatch, TreeQuery }

export interface TreeParams extends MongoDBAdapterParams<TreeQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class TreeService<ServiceParams extends Params = TreeParams> extends MongoDBService<
  Tree,
  TreeData,
  TreeParams,
  TreePatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('trees'))
  }
}
