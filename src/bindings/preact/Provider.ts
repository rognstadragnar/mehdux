import * as Preact from 'preact'
import { shallowMerge } from '../../lib/shallowMerge'
import { IStoreInstance } from './../../types'

interface IProps {
  store: IStoreInstance
}

class Provider extends Preact.Component<IProps, {}> {
  public static displayName = 'Provider'
  public getChildContext = () => ({ store: this.props.store })
  public render() {
    return this.props.children[0]
  }
}

Provider.displayName = 'Provider'

export { Provider }
