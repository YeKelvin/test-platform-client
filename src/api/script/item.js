import request from '@/utils/request'

export function queryItemList(query) {
  return request({
    url: '/script/item/list',
    method: 'get',
    params: query
  })
}

export function queryItemAll() {
  return request({
    url: '/script/item/all',
    method: 'get'
  })
}

export function createItem(data) {
  return request({
    url: '/script/item',
    method: 'post',
    data
  })
}

export function modifyItem(data) {
  return request({
    url: '/script/item',
    method: 'put',
    data
  })
}

export function deleteItem(data) {
  return request({
    url: '/script/item',
    method: 'delete',
    data
  })
}
