import { IStore, MapActionsToProps, MapStateToProps } from '../types'

interface IH {
  type: string
  props: object
  children: string | IH[] | IH
}
type Component = (...props: any[]) => IH

function connect(
  storeInstance,
  mapState: MapStateToProps,
  mapActions: MapActionsToProps
) {
  return component => {
    const propsFromState = () => ({
      ...storeInstance.getState(mapState),
      ...storeInstance.getActions(mapActions)
    })
    return props => component({ ...propsFromState(), ...props })
  }
}

export { connect }
