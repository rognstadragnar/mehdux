function isDifferent(a, b) {
  if (!a && !b) return typeof a === typeof b
  if (a === b) return false
  if ((!a && b) || (a && !b)) return true
  if (typeof a !== typeof b) return true
  if (Array.isArray(a)) return compareArray(a, b, isDifferent)
  if (typeof a === 'object') return compareObj(a, b, isDifferent)
  if (!a && !b) return typeof a === typeof b
  return true
}

function compareArray(a, b, recursion) {
  if (!Array.isArray(b)) return true
  if (a.length !== b.length) return true
  if (a.length === 0 && b.length === 0) return false
  return a.filter((item, idx) => recursion(item, b[idx])).length !== 0
}

function compareObj(a, b, recursion) {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  if (aKeys.length !== bKeys.length) return true
  const keyDiff =
    aKeys.filter((key, idx) => {
      if (key === bKeys[idx]) {
        return !recursion(a[key], b[key])
      }
      return false
    }).length === 0

  return keyDiff
}

export { isDifferent }
