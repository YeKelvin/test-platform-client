import request from '@/utils/request'

export function queryProjectList(query) {
  return request({
    url: '/script/project/list',
    method: 'get',
    params: query
  })
}

export function queryProjectAll() {
  return request({
    url: '/script/project/all',
    method: 'get'
  })
}

export function createProject(data) {
  return request({
    url: '/script/project',
    method: 'post',
    data
  })
}

export function modifyProject(data) {
  return request({
    url: '/script/project',
    method: 'put',
    data
  })
}

export function deleteProject(data) {
  return request({
    url: '/script/project',
    method: 'delete',
    data
  })
}
