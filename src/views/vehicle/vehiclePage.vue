<template>
  <div>
    <h1>车辆管理</h1>
  </div>
</template>

<script>
import { login } from '../../api/user'

export default {
  name: 'VehiclePage',
  created() {
    login().then()
  }
}
</script>

<style scoped>

</style>
