import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: `/distribution/getAllDistribution/${query}`,
    method: 'get'
  })
}

export function deleteDistribution(params) {
  return request({
    url: `/distribution/deleteDistribution/${params}`,
    method: 'get'
  })
}

export function updateDistribution(data) {
  return request({
    url: '/distribution/updateDistribution',
    method: 'post',
    params: data
  })
}
export function addDistribution(params) {
  return request({
    url: '/distribution/addDistribution',
    method: 'post',
    params: params
  })
}
