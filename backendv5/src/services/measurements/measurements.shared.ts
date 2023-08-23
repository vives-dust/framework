// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  Measurement,
  MeasurementQuery,
  MeasurementService
} from './measurements.class'

export type { Measurement, MeasurementQuery }

export type MeasurementClientService = Pick<
  MeasurementService<Params<MeasurementQuery>>,
  (typeof measurementMethods)[number]
>

export const measurementPath = 'measurements'

export const measurementMethods = ['find'] as const

export const measurementClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(measurementPath, connection.service(measurementPath), {
    methods: measurementMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [measurementPath]: MeasurementClientService
  }
}
