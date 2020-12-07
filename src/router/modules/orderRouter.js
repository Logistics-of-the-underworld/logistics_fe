import Layout from '@/layout/index'
export const orderRouter = {
  path: '/ordermanage',
  component: Layout,
  children: [
    {
      path: 'search',
      name: 'orderManage',
      component: () => import('@/views/order/order_manage/orderManagePage'),
      meta: {
        // 如果需要权限才能进入这个路由的话 就加这个
        roles: [['admin', 'root'], ['branchCompany', 'admin'], ['headCompany', 'admin'], ['distribution', 'admin']],
        // 菜单标题
        title: '订单管理',
        // 菜单的图标
        icon: 'el-icon-document'
      }
    }
  ]
}
