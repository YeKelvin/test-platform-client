import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function getUserList(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}

export function modifyUser(data) {
  return request({
    url: '/user',
    method: 'put',
    data
  })
}

export function getPermissionList(query) {
  return request({
    url: '/user/permission/list',
    method: 'get',
    params: query
  })
}

export function createPermission(data) {
  return request({
    url: '/user/permission',
    method: 'post',
    data
  })
}

export function modifyPermission(data) {
  return request({
    url: '/user/permission',
    method: 'put',
    data
  })
}

export function deletePermission(data) {
  return request({
    url: '/user/permission',
    method: 'delete',
    data
  })
}

export function getRoleList(query) {
  return request({
    url: '/user/role/list',
    method: 'get',
    params: query
  })
}

export function createRole(data) {
  return request({
    url: '/user/role',
    method: 'post',
    data
  })
}

export function modifyRole(data) {
  return request({
    url: '/user/role',
    method: 'put',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: '/user/role',
    method: 'delete',
    data
  })
}

export function getRolePermissionRelList(query) {
  return request({
    url: '/user/role/permission/rel/list',
    method: 'get',
    params: query
  })
}

export function createRolePermissionRel(data) {
  return request({
    url: '/user/role/permission/rel',
    method: 'post',
    data
  })
}

export function modifyRolePermissionRel(data) {
  return request({
    url: '/user/role/permission/rel',
    method: 'put',
    data
  })
}

export function deleteRolePermissionRel(data) {
  return request({
    url: '/user/role/permission/rel',
    method: 'delete',
    data
  })
}

