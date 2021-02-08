import request from '@/utils/request'

export const queryWorkspaceList = params => request.get('/script/workspace/list', { params: params })

export const queryWorkspaceAll = () => request.get('/script/workspace/all')

export const createWorkspace = data => request.post('/script/workspace', data)

export const modifyWorkspace = data => request.put('/script/workspace', data)

export const deleteWorkspace = data => request.delete('/script/workspace', data)
