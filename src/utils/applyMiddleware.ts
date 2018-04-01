import { IMiddlewareArg, Middlewares } from '../types'

const applyMiddleware = (...args: Middlewares): Middlewares => args

export { applyMiddleware, Middlewares, IMiddlewareArg }
