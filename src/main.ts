import { assembleStore } from './lib/assembleStore'
import { createActions } from './lib/helpers'

const Store = assembleStore(createActions, false)

export { Store }
