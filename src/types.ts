import { MapStateToProps } from './types'
export type Dispatch = (actionName: string, ...args: Array<any>) => void
export type SetState = (Object) => void
export type GetState = (MapStateToProps?) => object
export type State = object
export type Consumer = (Object) => any
export type Connection = (state: State, actions: ParsedActions) => void
export type Dispose = { dispose: () => void }
export type Action = (
  state: Object,
  dispatch: Dispatch
) => (...args: Array<any>) => State

export type Actions = {
  [propName: string]: Action
}
export type ParsedAction = (...args: Array<any>) => void
export type ParsedActions = {
  [propName: string]: ParsedAction
}
export type InitialState = {}

export type MapStateToProps = (state: {}) => Object | undefined
export type MapActionsToProps = (
  actions: ParsedActions
) => ParsedActions | undefined
