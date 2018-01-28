const mapObj = (r, fn) => {
  const o = {}
  for (let v in r) o[v] = fn(r[v])
  return o
}

const createActions = (actions, state, dispatch, setState) => {
  return mapObj(actions, fn => (...args) => {
    return setState(fn(state(), dispatch)(...args))
  })
}

export { mapObj, createActions }
