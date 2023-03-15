// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Trees, TreesData, TreesPatch, TreesQuery, TreesService } from './trees.class'

export type { Trees, TreesData, TreesPatch, TreesQuery }

export type TreesClientService = Pick<TreesService<Params<TreesQuery>>, (typeof treesMethods)[number]>

export const treesPath = 'trees'

export const treesMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const treesClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(treesPath, connection.service(treesPath), {
    methods: treesMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [treesPath]: TreesClientService
  }
}
