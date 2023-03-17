// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { NanoIdSchema } from '../../typebox-types/nano_id'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { LocationSchema } from '../../typebox-types/location'

// Main data model schema
export const treesSchema = Type.Object(
  {
    _id: NanoIdSchema,
    name: Type.String(),
    description: Type.String(),
    location: LocationSchema,
    image_url: Type.String(),
    // Auto-generated fields
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
    // Auto-generated virtual fields
    tree_url: Type.String({ format: 'uri' }),
  },
  { $id: 'Trees', additionalProperties: false }
)
export type Trees = Static<typeof treesSchema>
export const treesValidator = getValidator(treesSchema, dataValidator)
export const treesResolver = resolve<Trees, HookContext>({
  tree_url: virtual(async (tree, context) => {
    return `${context.app.get('application').domain}/${context.path}/${tree._id}`
  })
})

export const treesExternalResolver = resolve<Trees, HookContext>({
  createdAt: async () => undefined,
  updatedAt: async () => undefined,
})

// Schema for creating new entries
export const treesDataSchema = Type.Pick(treesSchema, ['name', 'description', 'location', 'image_url'], {
  $id: 'TreesData'
})
export type TreesData = Static<typeof treesDataSchema>
export const treesDataValidator = getValidator(treesDataSchema, dataValidator)
export const treesDataResolver = resolve<Trees, HookContext>({
  // TODO - Can we generate nano id here? Can't seem to get it to work
  createdAt: async () => (new Date()).toISOString(),
  updatedAt: async () => (new Date()).toISOString(),
})

// Schema for updating existing entries
export const treesPatchSchema = Type.Partial(Type.Omit(treesSchema, ['createdAt', 'updatedAt']), {
  $id: 'TreesPatch'
})
export type TreesPatch = Static<typeof treesPatchSchema>
export const treesPatchValidator = getValidator(treesPatchSchema, dataValidator)
export const treesPatchResolver = resolve<Trees, HookContext>({})

// Schema for allowed query properties
export const treesQueryProperties = Type.Pick(treesSchema, ['_id'])
export const treesQuerySchema = Type.Intersect(
  [
    querySyntax(treesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type TreesQuery = Static<typeof treesQuerySchema>
export const treesQueryValidator = getValidator(treesQuerySchema, queryValidator)
export const treesQueryResolver = resolve<TreesQuery, HookContext>({})
