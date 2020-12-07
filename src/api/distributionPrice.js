import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: `/deliveryPrice//getAllDeliveryPrice/${query}`,
    method: 'get'
  })
}

export function createDeliveryPrice(params) {
  return request({
    url: '/deliveryPrice/createOrder',
    method: 'post',
    params: params
  })
}

export function deleteDeliveryPrice(params) {
  return request({
    url: `/deliveryPrice/deteleDeliveryPrice/${params}`,
    method: 'get'
  })
}

export function updateDeliveryPrice(params) {
  return request({
    url: '/deliveryPrice/updateDeliveryPrice',
    method: 'post',
    params: params
  })
}
