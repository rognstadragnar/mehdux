type CompareFn = (a: any, b: any) => boolean

function isDifferent(a: any, b: any): boolean {
  if (!a && !b) return typeof a === typeof b
  if (a === b) return false
  if ((!a && b) || (a && !b)) return true
  if (typeof a !== typeof b) return true
  if (Array.isArray(a)) return compareArray(a, b, isDifferent)
  if (typeof a === 'object') return compareObj(a, b, isDifferent)
  if (!a && !b) return typeof a === typeof b
  return true
}

function compareArray(
  a: Array<any>,
  b: Array<any>,
  compareFn: CompareFn
): boolean {
  if (!Array.isArray(b)) return true
  if (a.length !== b.length) return true
  if (a.length === 0 && b.length === 0) return false
  return a.filter((item, idx) => compareFn(item, b[idx])).length !== 0
}

function compareObj(a: object, b: object, compareFn: CompareFn): boolean {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  if (aKeys.length !== bKeys.length) return true

  return aKeys.filter(
      (key, idx) => (key === bKeys[idx] ? compareFn(a[key], b[key]) : true)
    ).length !== 0
  
}

export { isDifferent }
