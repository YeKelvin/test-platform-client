import request from '@/utils/request'

export const queryTopicList = params => request.get('/script/topic/list', { params: params })

export const queryTopicAll = () => request.get('/script/topic/all')

export const createTopic = data => request.post('/script/topic', data)

export const modifyTopic = data => request.put('/script/topic', data)

export const deleteTopic = data => request.delete('/script/topic', data)
