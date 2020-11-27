import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/getAllTruck',
    method: 'get',
    params: query
  })
}
