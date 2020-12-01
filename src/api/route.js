import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/getAllRoute',
    method: 'get',
    params: query
  })
}

export function addRoute(params) {
  return request({
    url: '/addRoute',
    method: 'post',
    params: params
  })
}

export function deleteRoute(params) {
  return request({
    url: '/deleteRoute',
    method: 'get',
    params: params
  })
}

export function updateRoute(params) {
  return request({
    url: '/updateRoute',
    method: 'post',
    params: params
  })
}
