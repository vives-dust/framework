//////////////////////////////////////////////////////////////////////////////
// Data Resolvers
//  - Convert DATA from a create, update or patch
//  - Executed before the data is stored in the database
//  - AROUND or BEFORE hook
//  - As an 'all' hook, run only on methods with DATA
//  - Usage:
//      - Hash password
//      - Set updatedAt
//      - Remove properties that cannot be written
//      - Populate associations which are required in the creation process
//////////////////////////////////////////////////////////////////////////////

import { resolve } from '@feathersjs/schema'
import type { HookContext } from '../declarations'
import { nanoid } from 'nanoid/async';

// Set the _id field using a NanoID if none is provided
export const nanoIdDataResolver = resolve<any, HookContext>({
  _id: async (value, entity : any) => (value !== undefined) ? value : await nanoid(),
});

// Set the createdAt and updatedAt fields
// Can be used for both create and patch
export const timestampsDataResolver = resolve<any, HookContext>({
  createdAt: async (value, entity : any, context : HookContext) => (context.method == 'create') ? (new Date()).toISOString() : value,
  updatedAt: async () => (new Date()).toISOString(),
});