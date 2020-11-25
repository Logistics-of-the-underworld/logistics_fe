import Layout from '@/layout/index'

export const vehicleRouter = {
  path: '/vehicle',
  component: Layout,
  children: [
    {
      path: 'search',
      name: 'vehicle',
      component: () => import('@/views/vehicle/vehiclePage'),
      meta: {
        // 如果需要权限才能进入这个路由的话 就加这个
        roles: ['admin', 'root'],
        // 菜单标题
        title: '车辆管理',
        // 菜单的图标
        icon: 'el-icon-s-operation'
      }
    }
  ]
}
