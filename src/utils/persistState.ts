import { IState } from '../types'

interface IConfig {
  key: string
  expire?: number
  interval?: number
}

interface IPersistState {
  set: (State) => IState
  get: () => IState
  purge: () => void
}

const now = () => new Date().getTime()
const shouldBeDebounced = (lastSet?: number, interval?: number) => {
  return lastSet && lastSet < now() + interval
}

const persistState = (config: IConfig): IPersistState => {
  if (!config) {
    return null
  }
  let lastSet
  const { key, expire = null, interval = 1000 } = config
  if (!key) {
    throw new Error('You need to specify a key')
  }
  const set = (state: IState): IState => {
    if (shouldBeDebounced(lastSet, interval)) {
      return state
    }
    lastSet = now()
    const storage = {
      expiryDate: config.expire ? new Date().getTime() + config.expire : null,
      state
    }
    localStorage.setItem(key, JSON.stringify(storage))
    return state
  }
  const get = (): IState => {
    const fromStorage = JSON.parse(localStorage.getItem(key))
    if (fromStorage) {
      const { state, expiryDate } = fromStorage
      if (!expiryDate) {
        return state
      } else if (expiryDate > now()) {
        return state
      } else {
        purge()
      }
    }
    return {}
  }
  const purge = (): void => {
    if (key) {
      localStorage.removeItem(key)
    }
  }
  return { set, get, purge }
}

export { persistState }
