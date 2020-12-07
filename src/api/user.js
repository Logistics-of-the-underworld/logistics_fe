import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/auth/getInf',
    method: 'post',
    token
  })
}

export function getAuth(size, page) {
  return request({
    url: `/auth/manage/getAllAuth/${size}/${page}`,
    method: 'get'
  })
}

export function getAuthByOrg(org, size, page) {
  return request({
    url: `/auth/manage/getAuthByOrganization/${org}/${size}/${page}/0`,
    method: 'get'
  })
}

export function getRoleByIdentity() {
  return request({
    url: '/auth/role/getRoleByIdentity',
    method: 'get'
  })
}

export function changeRole(data) {
  return request({
    url: '/auth/role/changeRole',
    method: 'post',
    data
  })
}

export function deleteAuth(data) {
  return request({
    url: '/auth/manage/deleteAtuh',
    method: 'post',
    data
  })
}

export function verifyUsername(data) {
  return request({
    url: `/auth/verifyUsername/${data}`,
    method: 'get'
  })
}

export function verifyEmail(data) {
  return request({
    url: `/auth/verifyEmail/${data}`,
    method: 'get'
  })
}

export function verifyPhone(data) {
  return request({
    url: `/auth/verifyPhone/${data}`,
    method: 'get'
  })
}

export function register(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  })
}

export function getPhoneCode(data) {
  return request({
    url: '/auth/getPhoneLoginCode',
    method: 'post',
    data
  })
}

export function loginByPhone(data) {
  return request({
    url: '/auth/loginByPhone',
    method: 'post',
    data
  })
}
