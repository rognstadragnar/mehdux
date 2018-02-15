const persistState = (cfg) => {
  const { key } = cfg
  return {
    set: newState => key && localStorage.setItem(key, JSON.stringify(newState)),
    get: () => key && JSON.parse(localStorage.getItem(key)),
    purge: () => key && localStorage.removeItem(key)
  }
}

const myPersistantState = persistState({ key: 'my-persistant-state' })
console.log(myPersistantState.get())
myPersistantState.set({ myNewState: 'asdasdadsadasd' })