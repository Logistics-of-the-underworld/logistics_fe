<template>
  <el-tabs type="card" :before-leave="handleClick">
    <el-tab-pane label="路线查询"><views-page v-if="visible" /></el-tab-pane>
    <el-tab-pane label="地图显示"><route-page v-if="!visible" /></el-tab-pane>
  </el-tabs>
</template>

<script>
import routePage from './routePage'
import viewsPage from './viewsPage'
export default {
  name: 'IndexManage',
  components: {
    routePage,
    viewsPage
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
    }
  }
}
</script>

<style scoped>

</style>
