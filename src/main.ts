import { isDifferent } from './lib/diff'
import { createActions } from './lib/helpers'
import { assembleStore } from './lib/assembleStore'
import {
  State,
  Action,
  Actions,
  Connection,
  Consumer,
  Dispose,
  ParsedAction,
  ParsedActions,
  MapStateToProps,
  MapActionsToProps,
  StoreInstance,
  MiddlewareArg,
  Middleware,
  Middlewares,
  ExtraSetStateArgs
} from './types'

const Store = assembleStore(createActions)

export { Store }
