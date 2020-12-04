import Layout from '@/layout/index'
export const handoverRouter = {
  path: '/handover',
  component: Layout,
  children: [
    {
      path: 'search',
      name: 'handover-slip',
      component: () => import('@/views/handover-slip/handoverPage'),
      meta: {
        // 如果需要权限才能进入这个路由的话 就加这个
        roles: [['admin', 'root']],
        // 菜单标题
        title: '交接单管理',
        // 菜单的图标
        icon: 'el-icon-document-copy'
      }
    }
  ]
}
