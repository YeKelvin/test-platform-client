import request from '@/utils/request'

export const queryElementList = params => request.get('/script/element/list', { params: params })

export const queryElementAll = params => request.get('/script/element/all', { params: params })

export const queryElementInfo = params => request.get('/script/element/info', { params: params })

export const queryElementChildren = params => request.get('/script/element/children', { params: params })

export const createElement = data => request.post('/script/element', data)

export const modifyElement = data => request.put('/script/element', data)

export const deleteElement = data => request.delete('/script/element', data)

export const enableElement = data => request.patch('/script/element/enable', data)

export const disableElement = data => request.patch('/script/element/disable', data)

export const addElementProperty = data => request.post('/script/element/property', data)

export const modifyElementProperty = data => request.put('/script/element/property', data)

export const addElementChildren = data => request.post('/script/element/children', data)

export const modifyElementChildren = data => request.put('/script/element/children', data)

export const moveUpElementChildOrder = data => request.patch('/script/element/child/order/up', data)

export const moveDownElementChildOrder = data => request.patch('/script/element/child/order/down', data)

export const duplicateElement = data => request.post('/script/element/duplicate', data)

export const executeScript = data => request.post('/script/execute', data)
