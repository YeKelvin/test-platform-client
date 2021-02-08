import request from '@/utils/request'

export const queryActionLogList = params => request.get('/system/action/log/list', { params: params })
