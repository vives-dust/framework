// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, StringEnum } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'
import { valid_periods } from '../../influxdb/query_builder';

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const measurementsSchema = Type.Object(
  {
    value: Type.Number(),
    time: Type.String({ format: 'date-time' }),
  },
  { $id: 'Measurements', additionalProperties: false }
)
export type Measurements = Static<typeof measurementsSchema>
export const measurementsValidator = getValidator(measurementsSchema, dataValidator)
export const measurementsResolver = resolve<Measurements, HookContext>({})

export const measurementsExternalResolver = resolve<Measurements, HookContext>({})

// Schema for allowed query properties
export const measurementsQueryProperties = Type.Object(
  {
    // TODO - Should probable be revised.
    // For the moment not a problem since it's only for internal use
    bucket: Type.String(),
    measurement: Type.String(),
    // Optional query properties
    tags: Type.Optional(Type.Object({}, { additionalProperties: true })),
    fields: Type.Optional(Type.Array(Type.String(), { minItems: 1 })),
    drop: Type.Optional(Type.Array(Type.String(), { minItems: 1 })),
    period: Type.Optional(StringEnum(valid_periods)),
    start: Type.Optional(Type.String()),
    stop: Type.Optional(Type.String()),
    every: Type.Optional(Type.String()),
    aliases: Type.Optional(Type.Object({}, { additionalProperties: true })),
    pruneTags: Type.Optional(Type.Boolean()),
  },
  { $id: 'MeasurementsQueryProperties', additionalProperties: false }
)
export const measurementsQuerySchema = Type.Intersect(
  [
    querySyntax(measurementsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type MeasurementsQuery = Static<typeof measurementsQuerySchema>
export const measurementsQueryValidator = getValidator(measurementsQuerySchema, queryValidator)
export const measurementsQueryResolver = resolve<MeasurementsQuery, HookContext>({})
