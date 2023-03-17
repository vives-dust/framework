// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { NanoIdSchema } from '../../typebox-types/nano_id'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { LocationSchema } from '../../typebox-types/location'

// Main data model schema
export const treeSchema = Type.Object(
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
  { $id: 'Tree', additionalProperties: false }
)
export type Tree = Static<typeof treeSchema>
export const treeValidator = getValidator(treeSchema, dataValidator)
export const treeResolver = resolve<Tree, HookContext>({
  tree_url: virtual(async (tree, context) => {
    return `${context.app.get('application').domain}/${context.path}/${tree._id}`
  })
})

export const treeExternalResolver = resolve<Tree, HookContext>({
  createdAt: async () => undefined,
  updatedAt: async () => undefined,
})

// Schema for creating new entries
export const treeDataSchema = Type.Pick(treeSchema, ['name', 'description', 'location', 'image_url'], {
  $id: 'TreeData'
})
export type TreeData = Static<typeof treeDataSchema>
export const treeDataValidator = getValidator(treeDataSchema, dataValidator)
export const treeDataResolver = resolve<Tree, HookContext>({
  // TODO - Can we generate nano id here? Can't seem to get it to work
  createdAt: async () => (new Date()).toISOString(),
  updatedAt: async () => (new Date()).toISOString(),
})

// Schema for updating existing entries
export const treePatchSchema = Type.Partial(Type.Omit(treeSchema, ['createdAt', 'updatedAt']), {
  $id: 'TreePatch'
})
export type TreePatch = Static<typeof treePatchSchema>
export const treePatchValidator = getValidator(treePatchSchema, dataValidator)
export const treePatchResolver = resolve<Tree, HookContext>({})

// Schema for allowed query properties
export const treeQueryProperties = Type.Pick(treeSchema, ['_id'])
export const treeQuerySchema = Type.Intersect(
  [
    querySyntax(treeQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type TreeQuery = Static<typeof treeQuerySchema>
export const treeQueryValidator = getValidator(treeQuerySchema, queryValidator)
export const treeQueryResolver = resolve<TreeQuery, HookContext>({})
