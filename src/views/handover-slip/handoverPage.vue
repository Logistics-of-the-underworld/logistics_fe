<template>
  <el-table
    :data="tableData"
    border
    style="width: 100%"
  >
    <el-table-column
      prop="id_order"
      label="订单编号"
      width="180"
    />
    <el-table-column
      prop="id_package"
      label="封装货号"
      width="180"
    />
    <el-table-column
      prop="stat_spot"
      label="发货地"
    />
    <el-table-column
      prop="handover_spot"
      label="交接地"
    />
    <el-table-column
      prop="receiver_name"
      label="接收人签字"
      width="180"
    />
    <el-table-column
      prop="update_time"
      label="创建时间"
    />
    <el-table-column
      prop="update_time"
      label="更新时间"
    />
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)"
        >编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
        >删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'HandoverPage',
  data() {
    return {
      tableData: [{
        id_order: '01010101',
        id_package: '11111111',
        stat_spot: '上海市普陀区金沙江路 1518 弄',
        handover_spot: '上海市普陀区金沙江路 1518 弄',
        receiver_name: 'lily',
        create_time: '2016-05-04',
        update_time: '2016-05-04'
      }, {
        id_order: '02020202',
        id_package: '22222222',
        stat_spot: '上海市普陀区金沙江路 1518 弄',
        handover_spot: '上海市普陀区金沙江路 1518 弄',
        receiver_name: 'lily',
        create_time: '2016-05-04',
        update_time: '2016-05-04'
      }, {
        id_order: '03030303',
        id_package: '33333333',
        stat_spot: '上海市普陀区金沙江路 1518 弄',
        handover_spot: '上海市普陀区金沙江路 1518 弄',
        receiver_name: 'lily',
        create_time: '2016-05-04',
        update_time: '2016-05-04'
      }, {
        id_order: '04040404',
        id_package: '44444444',
        stat_spot: '上海市普陀区金沙江路 1518 弄',
        handover_spot: '上海市普陀区金沙江路 1518 弄',
        receiver_name: 'lily',
        create_time: '2016-05-04',
        update_time: '2016-05-04'
      }]
    }
  }
}
</script>

<style scoped>

</style>
