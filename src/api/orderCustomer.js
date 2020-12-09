import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/orderUser/getAllOrder',
    method: 'post',
    params: query
  })
}

export function getOne(query) {
  return request({
    url: `/orderUser/getOrderByID/${query}`,
    method: 'get'
  })
}

export function getPrice(params) {
  return request({
    url: '/orderUser/getAllOrder',
    method: 'post',
    params: params
  })
}
export function createOrder(params) {
  return request({
    url: '/orderUser/createOrder',
    method: 'post',
    params: params
  })
}

export function deleteOrder(params) {
  return request({
    url: `/orderUser/deleteOrder/${params}`,
    method: 'get'
  })
}

export function updateOrder(params) {
  return request({
    url: '/orderUser/updateOrder',
    method: 'post',
    params: params
  })
}
