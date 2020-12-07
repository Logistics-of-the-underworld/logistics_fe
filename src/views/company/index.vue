<template>
  <el-tabs type="card" :before-leave="handleClick">
    <el-tab-pane :label="this.management"><companyPage v-if="visible" /></el-tab-pane>
    <el-tab-pane :label="this.addWorker"><addCompanyPage v-if="!visible" /></el-tab-pane>
  </el-tabs>
</template>

<script>
import addCompanyPage from '@/views/company/addCompanyPage'
import companyPage from '@/views/company/companyPage'
export default {
  name: 'IndexManage',
  components: {
    addCompanyPage,
    companyPage
  },
  data() {
    return {
      visible: true,
      management: this.$store.getters.organizationName + ' - 公司管理',
      addWorker: this.$store.getters.organizationName + ' - 分公司设立'

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
