import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: `/handOver/getAllHandover/${query}`,
    method: 'get'
  })
}

export function getHandoverByID(params1, params2) {
  return request({
    url: `/handOver/getHandoverByidPackage/${params1}/${params2}`,
    method: 'get'
  })
}

export function deteleHandover(params1) {
  return request({
    url: `/handOver/deteleHandover/${params1}`,
    method: 'get'
  })
}

export function updateHandover(params) {
  return request({
    url: '/handOver/updateHandover',
    method: 'post',
    params: params
  })
}

export function addHandover(params) {
  return request({
    url: '/handOver/addHandover',
    method: 'post',
    params: params
  })
}
