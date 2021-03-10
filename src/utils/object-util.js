/**
 * 对象深拷贝
 * @param {*} obj
 * @returns
 */
export function deepCopy(obj) {
  if (typeof obj !== 'object') {
    return obj
  }

  const result = obj.constructor === Array ? [] : {}
  for (var i in obj) {
    result[i] = typeof obj[i] === 'object' ? deepCopy(obj[i]) : obj[i]
  }
  return result
}
