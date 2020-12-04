import Layout from '@/layout/index'
export const userRouter = {
  path: '/user',
  component: Layout,
  children: [
    {
      path: 'usermanage',
      name: 'usermanage',
      component: () => import('@/views/user/index'),
      meta: {
        // 如果需要权限才能进入这个路由的话 就加这个
        roles: [['admin', 'root'], ['branchCompany', 'admin'], ['headCompany', 'admin']],
        // 菜单标题
        title: '人事中心',
        // 菜单的图标
        icon: 'el-icon-user-solid'
      }
    }
  ]
}
