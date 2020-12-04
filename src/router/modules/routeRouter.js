import Layout from '@/layout/index'
export const routeRouter = {
  path: '/routemanage',
  component: Layout,
  children: [
    {
      path: 'manage',
      name: 'IndexManage',
      component: () => import('@/views/route/index'),
      meta: {
        // 如果需要权限才能进入这个路由的话 就加这个
        roles: [['admin', 'root']],
        // 菜单标题
        title: '路线管理',
        // 菜单的图标
        icon: 'el-icon-document-copy'
      }
    }
  ]
}
