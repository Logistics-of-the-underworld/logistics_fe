<template>
  <el-tabs type="card" :before-leave="handleClick">
    <el-tab-pane :label="this.management"><userPage v-if="visible" /></el-tab-pane>
    <el-tab-pane :label="this.addWorker"><addUserPage v-if="!visible" /></el-tab-pane>
  </el-tabs>
</template>

<script>
import userPage from '@/views/user/userPage'
import addUserPage from '@/views/user/addUserPage'
export default {
  name: 'IndexManage',
  components: {
    userPage,
    addUserPage
  },
  data() {
    return {
      visible: true,
      management: this.$store.getters.organizationName + ' - 人事管理',
      addWorker: this.$store.getters.organizationName + ' - 入职填报'

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
