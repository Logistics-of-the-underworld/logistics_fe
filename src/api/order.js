import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/getAllOrder',
    method: 'get',
    params: query
  })
}

export function createOrder(params) {
  return request({
    url: '/createOrder',
    method: 'post',
    params: params
  })
}

export function deleteOrder(params) {
  return request({
    url: '/delOrder',
    method: 'get',
    params: params
  })
}

export function updateOrder(params) {
  return request({
    url: '/updateOrder',
    method: 'post',
    params: params
  })
}
