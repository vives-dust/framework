//////////////////////////////////////////////////////////////////////////////
// Result Resolvers
//  - Manipulate the result returned by a service (get, find, patch, update ...)
//  - Must be used as AROUND hooks
//  - Usage:
//      - Add computed properties
//      - Populate associations
//////////////////////////////////////////////////////////////////////////////

import { resolve, virtual } from '@feathersjs/schema'
import type { HookContext } from '../declarations'

export const setResourceUrlExternalResolver = resolve<any, HookContext>({
  resource_url: virtual(async (entity, context) => {
    return `${context.app.get('application').domain}/${context.path}/${entity._id}`
  })
})