import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: `/distributionRange/getAllDistributionRange/${query}`,
    method: 'get'
  })
}

export function deleteDistributionRange(params) {
  return request({
    url: `/distributionRange/deleteDistributionRange/${params}`,
    method: 'get'
  })
}

export function updateDistributionRange(data) {
  return request({
    url: '/distributionRange/updateDistributionRange',
    method: 'post',
    params: data
  })
}
