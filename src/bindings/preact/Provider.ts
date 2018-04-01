import * as Preact from 'preact'
import { shallowMerge } from '../../lib/shallowMerge'
import { IStoreInstance } from './../../types'

export interface IProps {
  store: IStoreInstance
  storeKey?: string
}

class Provider extends Preact.Component<IProps, {}> {
  public static displayName = 'Provider'
  public getChildContext = () => ({
    [this.props.storeKey || '__MEHDUX_STORE__']: this.props.store
  })
  public render() {
    return this.props.children[0]
  }
}

Provider.displayName = 'Provider'

export { Provider }
