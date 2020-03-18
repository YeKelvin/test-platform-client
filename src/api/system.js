import request from '@/utils/request'

const prefix = '/system'

export function queryActionLogList(query) {
  return request({
    url: prefix + '/action/log/list',
    method: 'get',
    params: query
  })
}
