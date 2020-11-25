/**
 * 白名单，在此名单中的路由均为对外开放路由，无需登录即可访问
 * @type {string[]}
 */

const whiteList = [
  '/',
  '/about',
  '/login',
  '/registerPage',
  '/404',
  '/dashboard',
  '/example',
  '/form',
  '/form/index',
  '/nested'
] // no redirect whitelist

export default whiteList
