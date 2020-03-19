import request from '@/utils/request'

export function queryTopicList(query) {
  return request({
    url: '/script/topic/list',
    method: 'get',
    params: query
  })
}

export function queryTopicAll() {
  return request({
    url: '/script/topic/all',
    method: 'get'
  })
}

export function createTopic(data) {
  return request({
    url: '/script/topic',
    method: 'post',
    data
  })
}

export function modifyTopic(data) {
  return request({
    url: '/script/topic',
    method: 'put',
    data
  })
}

export function deleteTopic(data) {
  return request({
    url: '/script/topic',
    method: 'delete',
    data
  })
}
