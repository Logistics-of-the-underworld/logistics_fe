import request from '@/utils/request'
import da from 'element-ui/src/locale/lang/da'

export function fetchList(data) {
  return request({
    url: '/Vehicle_auth/getAllVehicle',
    method: 'post',
    data
  })
}

export function addTruck(data) {
  return request({
    url: '/Vehicle_auth/addVehicle',
    method: 'post',
    data
  })
}

export function deleteTruck(data) {
  return request({
    url: '/Vehicle_auth/deleteVehicle',
    method: 'post',
    data
  })
}

export function updateTruck(data) {
  return request({
    url: '/Vehicle_auth/updateVehicle',
    method: 'post',
    data
  })
}

export function getVehicleByOrg(data) {
  return request({
    url: `/Vehicle_auth/getVehicleByOrg/${data.org}/${data.current}/${data.size}`,
    method: 'get'
  })
}
