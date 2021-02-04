/**
 * 修改TestElement中的Propertys的keyName，在keyName前拼接className；
 * 作用：新增和修改TestElement时，修改请求参数中的keyName；
 * 目的：改名以满足数据的命名规范
 *
 * @param {string} element
 * @param {string} className
 */
export function renameKeyToRequest(element) {
  const renamedPropertys = {}
  Object.getOwnPropertyNames(element.propertys).forEach((key) => {
    renamedPropertys[`${element.className}.key`] = element.propertys[key]
  })
  element.propertys = renamedPropertys
}

/**
 * 修改TestElement中的Propertys的keyName，把keyName前的className去掉；
 * 作用：查询TestElement时，修改响应参数中的keyName；
 * 目的：改名以方便前端展示
 *
 * @param {sting} element
 */
export function renameKeyToView(element) {
  const renamedPropertys = {}
  Object.getOwnPropertyNames(element.propertys).forEach((key) => {
    const startIndex = key.indexOf('.')
    const renamedKey = key.substring(startIndex)
    renamedPropertys[renamedKey] = element.propertys[key]
  })
  element.propertys = renamedPropertys
}

export function iterChildren() {
  return
}
