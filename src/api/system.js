import request from '@/utils/request'

export function getActionLogList(query) {
  return request({
    url: '/action/log/list',
    method: 'get',
    params: query
  })
}
