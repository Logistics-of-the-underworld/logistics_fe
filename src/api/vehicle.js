import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/getAllVehicle',
    method: 'get',
    params: query
  })
}

export function addTruck(params) {
  return request({
    url: '/addTruck',
    method: 'post',
    params: params
  })
}

export function deleteTruck(params) {
  return request({
    url: '/deleteTruck',
    method: 'get',
    params: params
  })
}

export function updateTruck(params) {
  return request({
    url: '/updateTruck',
    method: 'post',
    params: params
  })
}
