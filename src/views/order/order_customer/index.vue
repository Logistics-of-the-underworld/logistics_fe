<template>
  <el-tabs type="border-card" @tab-click="handleClick">
    <el-tab-pane label="物流查询"><order-customer-page /></el-tab-pane>
    <el-tab-pane label="地图显示"><camap /></el-tab-pane>
  </el-tabs>
</template>

<script>
import orderCustomerPage from './orderCustomerPage'
import camap from './camap'
export default {
  name: 'OrderIndex',
  components: {
    orderCustomerPage,
    camap
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style scoped>

</style>
