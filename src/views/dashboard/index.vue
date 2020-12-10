<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LineChart from './components/LineChart'
import PanelGroup from './components/PanelGroup'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165, 123, 198, 135, 146, 125],
    actualData: [120, 82, 91, 154, 162, 140, 145, 186, 195, 105, 113, 128]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140, 123, 65, 159, 111, 241],
    actualData: [180, 160, 151, 106, 145, 150, 130, 123, 147, 168, 146, 185]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100, 145, 212, 182, 192, 163],
    actualData: [120, 90, 100, 138, 142, 130, 130, 201, 121, 174, 156, 143]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160, 178, 139, 102, 119, 172],
    actualData: [120, 82, 91, 154, 162, 140, 130, 182, 139, 140, 181, 222]
  }
}
export default {
  name: 'Dashboard',
  components: {
    LineChart,
    PanelGroup
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0px;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
</style>
