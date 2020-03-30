import request from '@/utils/request'

export function queryElementList(query) {
  return request({
    url: '/script/element/list',
    method: 'get',
    params: query
  })
}

export function queryElementAll(query) {
  return request({
    url: '/script/element/all',
    method: 'get',
    params: query
  })
}

export function queryElementInfo(query) {
  return request({
    url: '/script/element/info',
    method: 'get',
    params: query
  })
}

export function queryElementChild(query) {
  return request({
    url: '/script/element/child',
    method: 'get',
    params: query
  })
}

export function createElement(data) {
  return request({
    url: '/script/element',
    method: 'post',
    data
  })
}

export function modifyElement(data) {
  return request({
    url: '/script/element',
    method: 'put',
    data
  })
}

export function deleteElement(data) {
  return request({
    url: '/script/element',
    method: 'delete',
    data
  })
}

export function enableElement(data) {
  return request({
    url: '/script/element/enable',
    method: 'patch',
    data
  })
}

export function disableElement(data) {
  return request({
    url: '/script/element/disable',
    method: 'patch',
    data
  })
}

export function addElementProperty(data) {
  return request({
    url: '/script/element/property',
    method: 'post',
    data
  })
}

export function modifyElementProperty(data) {
  return request({
    url: '/script/element/property',
    method: 'put',
    data
  })
}

export function addElementChild(data) {
  return request({
    url: '/script/element/child',
    method: 'post',
    data
  })
}

export function modifyElementChild(data) {
  return request({
    url: '/script/element/child',
    method: 'put',
    data
  })
}

export function moveUpElementChildOrder(data) {
  return request({
    url: '/script/element/child/order/up',
    method: 'patch',
    data
  })
}

export function moveDownElementChildOrder(data) {
  return request({
    url: '/script/element/child/order/down',
    method: 'patch',
    data
  })
}
