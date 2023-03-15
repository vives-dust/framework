// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  Measurements,
  MeasurementsQuery,
  MeasurementsService
} from './measurements.class'

export type { Measurements, MeasurementsQuery }

export type MeasurementsClientService = Pick<
  MeasurementsService<Params<MeasurementsQuery>>,
  (typeof measurementsMethods)[number]
>

export const measurementsPath = 'measurements'

export const measurementsMethods = ['find'] as const

export const measurementsClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(measurementsPath, connection.service(measurementsPath), {
    methods: measurementsMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [measurementsPath]: MeasurementsClientService
  }
}
