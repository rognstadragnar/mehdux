const isObj = (a) => {
  return a && !Array.isArray(a) && typeof a === 'object'
}

const shallowMerge = (a: {}, b: {}): {} => {
  const obj = {} 
  for (let key in a) {
    obj[key] = isObj(a[key]) ? Object.assign({}, a[key], b[key]) : a[key] 
  }
  for (let key in b) {
    obj[key] = isObj(b[key]) ? Object.assign({}, a[key], b[key]) : b[key] 
  }
  return obj
}

export { shallowMerge }
