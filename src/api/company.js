import request from '@/utils/request'

export function getCompany(data) {
  return request({
    url: `/company/getAllCompany`,
    method: 'post',
    data
  })
}

export function addCompany(data) {
  return request({
    url: `/company/addCompany`,
    method: 'post',
    data
  })
}

export function deleteCompany(data) {
  return request({
    url: `/company/deleteCompany/${data}`,
    method: 'get'
  })
}

export function verifyCompanyName(data) {
  return request({
    url: `/company/verifyCompanyName`,
    method: 'post',
    data
  })
}
