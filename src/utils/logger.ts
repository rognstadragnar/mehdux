import { State, MiddlewareArg } from './../types';

const logger = (
  state: State,
  { prevState, args, name }: MiddlewareArg
): State => {
  console.group(`Recieved action: ${name}`);
  console.info(`Arguments: ${args.join[', ']}.`);
  console.info('Previous state:', prevState);
  console.info('Next state:', state);
  console.groupEnd();
  return state;
};

export { logger }