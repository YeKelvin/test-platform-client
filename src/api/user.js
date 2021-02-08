import request from '@/utils/request'

export const encryptionFactor = params => request.get('/user/encryption/factor', { params: params })

export const login = data => request.post('/user/login', data)

export const logout = data => request.post('/user/logout', data)

export const register = data => request.post('/user/register', data)

export const resetPassword = data => request.patch('/user/password/reset', data)

export const queryInfo = () => request.get('/user/info')

export const queryUserList = params => request.get('/user/list', { params: params })

export const queryUserAll = () => request.get('/user/all')

export const modifyUser = data => request.put('/user/info', data)

export const modifyUserState = data => request.patch('/user/info/state', data)

export const deleteUser = data => request.delete('/user', data)

export const queryPermissionList = params => request.get('/user/permission/list', { params: params })

export const queryPermissionAll = () => request.get('/user/permission/all')

export const createPermission = data => request.post('/user/permission', data)

export const modifyPermission = data => request.put('/user/permission', data)

export const modifyPermissionState = data => request.patch('/user/permission/state', data)

export const deletePermission = data => request.delete('/user/permission', data)

export const queryRoleList = params => request.get('/user/role/list', { params: params })

export const queryRoleAll = () => request.get('/user/role/all')

export const createRole = data => request.post('/user/role', data)

export const modifyRole = data => request.put('/user/role', data)

export const modifyRoleState = data => request.patch('/user/role/state', data)

export const deleteRole = data => request.delete('/user/role', data)

export const queryUserRoleRelList = params => request.get('/user/role/rel/list', { params: params })

export const createUserRoleRel = data => request.post('/user/role/rel', data)

export const deleteUserRoleRel = data => request.delete('/user/role/rel', data)

export const queryRolePermissionRelList = params => request.get('/user/role/permission/rel/list', { params: params })

export const createRolePermissionRel = data => request.post('/user/role/permission/rel', data)

export const deleteRolePermissionRel = data => request.delete('/user/role/permission/rel', data)
