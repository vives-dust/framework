// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  ConversionModels,
  ConversionModelsData,
  ConversionModelsPatch,
  ConversionModelsQuery,
  ConversionModelsService
} from './conversionmodels.class'

export type { ConversionModels, ConversionModelsData, ConversionModelsPatch, ConversionModelsQuery }

export type ConversionModelsClientService = Pick<
  ConversionModelsService<Params<ConversionModelsQuery>>,
  (typeof conversionModelsMethods)[number]
>

export const conversionModelsPath = 'conversionmodels'

export const conversionModelsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const conversionModelsClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(conversionModelsPath, connection.service(conversionModelsPath), {
    methods: conversionModelsMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [conversionModelsPath]: ConversionModelsClientService
  }
}
