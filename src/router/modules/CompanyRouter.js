import Layout from '@/layout/index'
export const companyRouter = {
  path: '/company',
  component: Layout,
  children: [
    {
      path: 'management',
      name: 'companyInfo',
      component: () => import('@/views/company/index'),
      meta: {
        // 如果需要权限才能进入这个路由的话 就加这个
        roles: [['headCompany', 'admin']],
        // 菜单标题
        title: '公司管理',
        // 菜单的图标
        icon: 'el-icon-office-building'
      }
    }
  ]
}
