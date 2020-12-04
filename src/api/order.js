import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/order/getAllOrder',
    method: 'post',
    params: query
  })
}

export function createOrder(params) {
  return request({
    url: '/order/createOrder',
    method: 'post',
    params: params
  })
}

export function deleteOrder(params) {
  return request({
    url: `/order/deleteOrder/${params}`,
    method: 'get',
  })
}

export function updateOrder(params) {
  return request({
    url: '/order/updateOrder',
    method: 'post',
    params: params
  })
}
