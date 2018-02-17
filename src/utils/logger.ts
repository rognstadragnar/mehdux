import { IMiddlewareArg, IState } from './../types'

const logger = (
  state: IState,
  { prevState, args, name }: IMiddlewareArg
): IState => {
  if (typeof window.console !== undefined) {
    console.group(`Recieved action: ${name}`) // tslint:disable-line:no-console
    console.info(`Arguments: ${args.join[', ']}.`) // tslint:disable-line:no-console
    console.info('Previous state:', prevState) // tslint:disable-line:no-console
    console.info('Next state:', state) // tslint:disable-line:no-console
    console.groupEnd() // tslint:disable-line:no-console
  }
  return state
}

export { logger }
