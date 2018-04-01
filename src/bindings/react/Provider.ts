import * as React from 'react'
import { shallowMerge } from '../../lib/shallowMerge'
import { IStoreInstance } from './../../types'
import { contextType } from './helpers'

export interface IProps {
  store: IStoreInstance
}

class Provider extends React.Component<IProps> {
  public getChildContext() {
    return { store: this.props.store }
  }
  public render() {
    return React.Children.only(this.props.children)
  }
}
// @ts-ignore
Provider.displayName = 'Provider'
// @ts-ignore
Provider.childContextTypes = contextType

export { Provider }
