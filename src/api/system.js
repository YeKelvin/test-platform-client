import request from '@/utils/request'

const prefix = '/system'

export function getActionLogList(query) {
  return request({
    url: prefix + '/action/log/list',
    method: 'get',
    params: query
  })
}
