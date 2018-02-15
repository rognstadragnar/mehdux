import { State } from '../types'

interface Config {
  key: string,
  expire?: number,
  interval?: number
}

interface PersistState {
  set: (State) => State,
  get: () => State,
  purge: () => void
}

const now = () => new Date().getTime()
const shouldBeDebounced = (lastSet?: number, interval?: number) => {
  return lastSet && lastSet < now() + interval
}

const persistState = (config: Config): PersistState => {
  if (!config) return null
  let lastSet;
  const { key, expire = null, interval = 1000 } = config
  if (!key) throw new Error('You need to specify a key')
  const set = state => {
      if (shouldBeDebounced(lastSet, interval)) {
        return state
      }
      lastSet = now()
      const storage = {
        state,
        expiryDate: config.expire ? new Date().getTime() + config.expire : null 
      }
      localStorage.setItem(key, JSON.stringify(storage))
      return state
    }
  const get = () => {
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
  const purge = () => {
    key && localStorage.removeItem(key)
  }
  return { set, get, purge }
}

export { persistState }
