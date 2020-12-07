<template>
  <el-tabs type="card" :before-leave="handleClick">
    <el-tab-pane label="物流查询"><order-customer-page v-if="visible"/></el-tab-pane>
    <el-tab-pane label="地图显示"><camap v-if="!visible"/></el-tab-pane>
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
  data() {
    return {
      visible: true
    }
  },
  methods: {
    handleClick(activeName, oldActiveName) {
      if (activeName === '0') {
        this.visible = true
      } else {
        this.visible = false
      }
      console.log(this.visible)
    }
  }
}
</script>

<style scoped>

</style>
