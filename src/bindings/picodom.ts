import {
  Store,
  MapStateToProps,
  MapActionsToProps
} from '../types'

type H = {
  type: string,
  props: object,
  children: string | Array<H> | H
}
type Component = (...props: Array<any>) => H

function connect(storeInstance, mapState: MapStateToProps, mapActions: MapActionsToProps) {
  return (component) => {
    const propsFromState = () => ({
      ...storeInstance.getState(mapState),
      ...storeInstance.getActions(mapActions),
    });
    return props => component({ ...propsFromState(), ...props });
  };
}

export { connect }