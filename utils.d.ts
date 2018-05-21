import {
  IStoresObject,
  combinedMiddlewares,
  IConfig,
  IMiddlewareArg,
  IPersistState,
  IStoreInstance
} from './src/types'

export function combineStores(
  stores: IStoresObject,
  newMiddlewares: combinedMiddlewares
): IStoreInstance

export const applyMiddleware: (
  ...args: ((newState: any, arg: IMiddlewareArg) => any)[]
) => ((newState: any, arg: IMiddlewareArg) => any)[]

export const logger: (
  state: any,
  { prevState, args, name }: IMiddlewareArg
) => any

export const persistState: (config: IConfig) => IPersistState
