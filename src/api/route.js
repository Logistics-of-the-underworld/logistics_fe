import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/route/getAllRoute',
    method: 'post',
    params: query
  })
}

export function addRoute(params) {
  return request({
    url: '/route/addRoute',
    method: 'post',
    params: params
  })
}

export function deleteRoute(params) {
  return request({
    url: '/route/deleteRoute',
    method: 'get',
    params: params
  })
}

export function updateRoute(params) {
  return request({
    url: '/route/updateRoute',
    method: 'post',
    params: params
  })
}

export function getRoadMap(params) {
  return request({
    url: '/route/getRoadMap',
    method: 'get',
    params: params
  })
}
