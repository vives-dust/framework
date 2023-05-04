// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { NanoIdSchema } from '../../typebox-types/nano_id'
import { LocationSchema } from '../../typebox-types/location'

// Main data model schema
export const treeSchema = Type.Object(
  {
    // Database fields
    _id: NanoIdSchema,              // The ID of the tree
    name: Type.String(),            // A human readable name for the tree
    description: Type.String(),     // A description for the tree chosen by the user
    location: LocationSchema,       // The location of the tree
    image_url: Type.String(),       // A url of a picture of the tree

    // Auto-generated fields (also stored in database)
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),

    // Computed properties
    resource_url: Type.String({ format: 'uri' }),

  },
  { $id: 'Tree', additionalProperties: false }
)

// A Typescript type for the schema
export type Tree = Static<typeof treeSchema>
export const treeValidator = getValidator(treeSchema, dataValidator)



//////////////////////////////////////////////////////////
// RESULT RESOLVERS
//////////////////////////////////////////////////////////

export const treeResolver = resolve<Tree, HookContext>({})
export const treeExternalResolver = resolve<Tree, HookContext>({})



//////////////////////////////////////////////////////////
// CREATING NEW ENTITIES
//////////////////////////////////////////////////////////

// Schema for creating new entries
export const treeDataSchema = Type.Intersect([
    Type.Partial(Type.Pick(treeSchema, ['_id'])),                         // Allow _id but don't require it
    Type.Pick(treeSchema, ['name', 'description', 'location', 'image_url'])
  ], {
  $id: 'TreeData'
})



export type TreeData = Static<typeof treeDataSchema>
export const treeDataValidator = getValidator(treeDataSchema, dataValidator)
export const treeDataResolver = resolve<Tree, HookContext>({})



//////////////////////////////////////////////////////////
// UPDATING EXISTING ENTITIES
//////////////////////////////////////////////////////////

// Schema for updating existing entries
export const treePatchSchema = Type.Partial(
  // Need to Pick here because otherwise we can inject createdAt, resource_url, ...
  // No need to disallow _id here, it is ignored; but it makes API more user friendly
  Type.Pick(treeSchema, ['_id', 'name', 'description', 'location', 'image_url']), {
  $id: 'TreePatch'
})

export type TreePatch = Static<typeof treePatchSchema>
export const treePatchValidator = getValidator(treePatchSchema, dataValidator)
export const treePatchResolver = resolve<Tree, HookContext>({})



//////////////////////////////////////////////////////////
// QUERYING ENTITIES
//////////////////////////////////////////////////////////

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
