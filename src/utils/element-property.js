export function renameKeyToView(element, className) {
  const renamedPropertys = {}
  Object.getOwnPropertyNames(element.propertys).forEach((key) => {
    renamedPropertys[`${className}key`] = element.propertys[key]
  })
  element.propertys = renamedPropertys
}

export function renameKeyToRequest(props) {
  const propertys = {}
  Object.getOwnPropertyNames(props).forEach((key) => {
    const startIndex = key.indexOf('.')
    const renamedKey = key.substring(startIndex)
    propertys[renamedKey] = props[key]
  })
  return propertys
}

export function iterChildren() {
  return
}
