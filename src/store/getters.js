const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  username: state => state.user.username,
  roles: state => state.user.roles,
  email: state => state.user.email,
  phone: state => state.user.phone,
  petName: state => state.user.petName,
  icon: state => state.user.icon,
  organizationName: state => state.user.organizationName,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs
}
export default getters
