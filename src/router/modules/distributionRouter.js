import Layout from '@/layout/index'
export const distributionRouter = {
  path: '/distribution',
  component: Layout,
  redirect: 'noRedirect',
  name: 'distribution',
  meta: {
    title: '配送点',
    icon: 'component',
    roles: [['admin', 'root']]
  },
  children: [
    {
      path: 'spot',
      name: 'distribution-spot',
      component: () => import('@/views/distribution/distributionPage'),
      meta: {
        // 如果需要权限才能进入这个路由的话 就加这个
        roles: [['admin', 'root']],
        // 菜单标题
        title: '配送站点管理',
        // 菜单的图标
        icon: 'el-icon-document-copy'
      }
    },
    {
      path: 'range',
      name: 'distribution-range',
      component: () => import('@/views/distribution/distribution-range'),
      meta: {
        roles: [['admin', 'root']],
        title: '配送范围管理',
        icon: 'el-icon-document-copy'
      }
    },
    {
      path: 'priceinfo',
      name: 'distribution-price',
      component: () => import('@/views/distribution/distribution-price'),
      meta: {
        roles: [['admin', 'root']],
        title: '配送价格',
        icon: 'el-icon-document-copy'
      }
    }
  ]
}
