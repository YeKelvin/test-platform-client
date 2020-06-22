import request from '@/utils/request'

export function encryptionFactor(query) {
  return request({
    url: '/encryption/factor',
    method: 'get',
    params: query
  })
}

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

export function resetPassword(data) {
  return request({
    url: '/user/password/reset',
    method: 'patch',
    data
  })
}

export function queryInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function queryUserList(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}

export function queryUserAll() {
  return request({
    url: '/user/all',
    method: 'get'
  })
}

export function modifyUser(data) {
  return request({
    url: '/user/info',
    method: 'put',
    data
  })
}

export function modifyUserState(data) {
  return request({
    url: '/user/info/state',
    method: 'patch',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: '/user',
    method: 'delete',
    data
  })
}

export function queryPermissionList(query) {
  return request({
    url: '/user/permission/list',
    method: 'get',
    params: query
  })
}

export function queryPermissionAll() {
  return request({
    url: '/user/permission/all',
    method: 'get'
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

export function modifyPermissionState(data) {
  return request({
    url: '/user/permission/state',
    method: 'patch',
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

export function queryRoleList(query) {
  return request({
    url: '/user/role/list',
    method: 'get',
    params: query
  })
}

export function queryRoleAll() {
  return request({
    url: '/user/role/all',
    method: 'get'
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

export function modifyRoleState(data) {
  return request({
    url: '/user/role/state',
    method: 'patch',
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

export function queryUserRoleRelList(query) {
  return request({
    url: '/user/role/rel/list',
    method: 'get',
    params: query
  })
}

export function createUserRoleRel(data) {
  return request({
    url: '/user/role/rel',
    method: 'post',
    data
  })
}

export function deleteUserRoleRel(data) {
  return request({
    url: '/user/role/rel',
    method: 'delete',
    data
  })
}

export function queryRolePermissionRelList(query) {
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

export function deleteRolePermissionRel(data) {
  return request({
    url: '/user/role/permission/rel',
    method: 'delete',
    data
  })
}

