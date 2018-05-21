const flattenArray = (arr: any[]): any[] => [].concat.apply([], arr)

const isObj = arg => {
  return Object.prototype.toString.call(arg) === '[object Object]'
}

const shallowMerge = (a: {}, b: {}): {} => {
  const obj = {}
  for (const key in a) {
    if (a.hasOwnProperty(key)) {
      obj[key] = isObj(a[key]) ? { ...a[key], ...b[key] } : a[key]
    }
  }
  for (const key in b) {
    if (b.hasOwnProperty(key)) {
      obj[key] = isObj(b[key]) ? { ...a[key], ...b[key] } : b[key]
    }
  }
  return obj
}

export { isObj, shallowMerge, flattenArray }
