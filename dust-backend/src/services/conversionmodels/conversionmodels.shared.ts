// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  ConversionModel,
  ConversionModelData,
  ConversionModelPatch,
  ConversionModelQuery,
  ConversionModelService
} from './conversionmodels.class'

export type { ConversionModel, ConversionModelData, ConversionModelPatch, ConversionModelQuery }

export type ConversionModelClientService = Pick<
  ConversionModelService<Params<ConversionModelQuery>>,
  (typeof conversionModelMethods)[number]
>

export const conversionModelPath = 'conversionmodels'

export const conversionModelMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const conversionModelClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(conversionModelPath, connection.service(conversionModelPath), {
    methods: conversionModelMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [conversionModelPath]: ConversionModelClientService
  }
}
