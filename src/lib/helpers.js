const mapObj = (root, map) => {
  const obj = {}
  for (let v in root) {
    obj[v] = map(v, root[v])
  }
  return obj
}

const createActions = (actions, update) => {
  return mapObj(actions, (key, value) => (...args) => {
    const { msg, payload } = value(...args)
    return update(msg, payload)
  })
}

export { mapObj, createActions }
