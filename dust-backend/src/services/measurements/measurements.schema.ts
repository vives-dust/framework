// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, StringEnum } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'
import { valid_periods } from '../../influxdb/query_builder';

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const measurementSchema = Type.Object(
  {
    value: Type.Number(),
    time: Type.String({ format: 'date-time' }),
  },
  { $id: 'Measurement', additionalProperties: false }
)
export type Measurement = Static<typeof measurementSchema>
export const measurementValidator = getValidator(measurementSchema, dataValidator)
export const measurementResolver = resolve<Measurement, HookContext>({})

export const measurementExternalResolver = resolve<Measurement, HookContext>({})

// Schema for allowed query properties
export const measurementQueryProperties = Type.Object(
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
export const measurementQuerySchema = Type.Intersect(
  [
    querySyntax(measurementQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type MeasurementQuery = Static<typeof measurementQuerySchema>
export const measurementQueryValidator = getValidator(measurementQuerySchema, queryValidator)
export const measurementQueryResolver = resolve<MeasurementQuery, HookContext>({})
