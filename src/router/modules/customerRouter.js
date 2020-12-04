import Layout from '@/layout/index'
export const customerRouter = {
  path: '/customer',
  component: Layout,
  children: [
    {
      path: 'info',
      name: 'userinfo',
      component: () => import('@/views/customer/customerPage'),
      meta: {
        // 如果需要权限才能进入这个路由的话 就加这个
        roles: [['user', 'normal']],
        // 菜单标题
        title: '用户个人中心',
        // 菜单的图标
        icon: 'el-icon-document-copy'
      }
    }
  ]
}
