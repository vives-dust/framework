//////////////////////////////////////////////////////////////////////////////
// External/Dispatch Resolvers
//  - Return safe version of the RESULT data that will be send to EXTERNAL clients
//  - Properties can return undefined to be excluded from the result
//  - AROUND (make sure it's FIRST) or AFTER (make sure it's LAST) hook
//  - Usage:
//      - Mainly for removing sensitive or unwanted data
//////////////////////////////////////////////////////////////////////////////

import { resolve } from '@feathersjs/schema'
import type { HookContext } from '../declarations'

export const removeTimeStampsExternalResolver = resolve<any, HookContext>({
  createdAt: async () => undefined,
  updatedAt: async () => undefined,
})