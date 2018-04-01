import { assembleStore } from './lib/assembleStore'
import { createActions } from './lib/helpers'
import { IActions, IMiddlewareArg } from './types'

const Store = assembleStore(createActions, false)

export { Store }
