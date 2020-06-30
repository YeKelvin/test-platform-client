import request from '@/utils/request'

export function queryWorkspaceList(query) {
  return request({
    url: '/script/workspace/list',
    method: 'get',
    params: query
  })
}

export function queryWorkspaceAll() {
  return request({
    url: '/script/workspace/all',
    method: 'get'
  })
}

export function createWorkspace(data) {
  return request({
    url: '/script/workspace',
    method: 'post',
    data
  })
}

export function modifyWorkspace(data) {
  return request({
    url: '/script/workspace',
    method: 'put',
    data
  })
}

export function deleteWorkspace(data) {
  return request({
    url: '/script/workspace',
    method: 'delete',
    data
  })
}
