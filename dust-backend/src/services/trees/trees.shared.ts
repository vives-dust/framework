// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Tree, TreeData, TreePatch, TreeQuery, TreeService } from './trees.class'

export type { Tree, TreeData, TreePatch, TreeQuery }

export type TreeClientService = Pick<TreeService<Params<TreeQuery>>, (typeof treeMethods)[number]>

export const treePath = 'trees'

export const treeMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const treeClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(treePath, connection.service(treePath), {
    methods: treeMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [treePath]: TreeClientService
  }
}
