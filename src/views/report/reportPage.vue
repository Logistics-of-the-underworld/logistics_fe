<template>
  <el-table
    :data="tableData"
    style="width: 100%"
  >
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="报表编号">
            <span>{{ props.row.id_report }}</span>
          </el-form-item>
          <el-form-item label="所属公司">
            <span>{{ props.row.name_company }}</span>
          </el-form-item>
          <el-form-item label="配送点名称">
            <span>{{ props.row.name_distribution }}</span>
          </el-form-item>
          <el-form-item label="配送货物总重量">
            <span>{{ props.row.count_heavy }}t</span>
          </el-form-item>
          <el-form-item label="配送货物总体积">
            <span>{{ props.row.count_volume }}m³</span>
          </el-form-item>
          <el-form-item label="配送收入">
            <span>{{ props.row.count_price }}¥</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      label="报表编号"
      prop="id_report"
    />
    <el-table-column
      label="报表时间"
      prop="create_time"
    />
    <el-table-column
      label="所属公司"
      prop="name_company"
    />
    <el-table-column
      label="配送货物总重量"
      prop="count_heavy"
    />
    <el-table-column
      label="配送货物总体积"
      prop="count_volume"
    />
    <el-table-column
      label="配送收入"
      prop="count_price"
    />
  </el-table>
</template>

<script>
export default {
  name: 'ReportPage',
  data() {
    return {
      tableData: [{
        id_report: '12987122',
        name_company: '好滋好味鸡蛋仔',
        count_heavy: 18,
        count_price: 21.00,
        count_volume: 88.35,
        name_distribution: '王小虎夫妻店',
        create_time: '2020-11-28 13:44'
      }, {
        id_report: '12987123',
        name_company: '好滋好味鸡蛋仔',
        count_heavy: 18,
        count_price: 21.00,
        count_volume: 88.35,
        name_distribution: '王小虎夫妻店',
        create_time: '2020-11-28 13:44'
      }, {
        id_report: '12987125',
        name_company: '好滋好味鸡蛋仔',
        count_heavy: 18,
        count_price: 21.00,
        count_volume: 88.35,
        name_distribution: '王小虎夫妻店',
        create_time: '2020-11-28 13:44'
      }, {
        id_report: '12987126',
        name_company: '好滋好味鸡蛋仔',
        count_heavy: 18,
        count_price: 21.00,
        count_volume: 88.35,
        name_distribution: '王小虎夫妻店',
        create_time: '2020-11-28 13:44'
      }]
    }
  }
}
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
