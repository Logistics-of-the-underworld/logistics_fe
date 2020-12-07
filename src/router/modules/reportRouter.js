import Layout from '@/layout/index'
export const reportRouter = {
  path: '/report',
  component: Layout,
  children: [
    {
      path: 'search',
      name: 'reportsearch',
      component: () => import('@/views/report/reportPage'),
      meta: {
        // 如果需要权限才能进入这个路由的话 就加这个
        roles: [['admin', 'root'], ['branchCompany', 'admin'], ['headCompany', 'admin']],
        // 菜单标题
        title: '报表管理',
        // 菜单的图标
        icon: 'el-icon-document-copy'
      }
    }
  ]
}
