<template>
  <el-table
    :data="tableData"
    style="width: 100%"
    :row-class-name="tableRowClassName"
  >
    <el-table-column
      prop="id_delivery_price"
      label="配送价格编码"
      width="180"
    />
    <el-table-column
      prop="spot_or_range"
      label="配送点价格或配送范围价格"
      width="180"
    />
    <el-table-column
      prop="first_kilogram"
      label="首公斤"
    />
    <el-table-column
      prop="second_kilogram"
      label="次公斤"
    />
    <el-table-column
      prop="first_cubic"
      label="首立方"
    />
    <el-table-column
      prop="second_cubic"
      label="次立方"
    />
    <el-table-column
      prop="price"
      label="价格"
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
  name: 'DistributionPrice',
  data() {
    return {
      tableData: [{
        id_delivery_price: '101',
        spot_or_range: '配送点价格',
        first_kilogram: '2',
        second_kilogram: '1',
        first_cubic: '2',
        second_cubic: '2',
        price: '50'
      }, {
        id_delivery_price: '102',
        spot_or_range: '配送点价格',
        first_kilogram: '2',
        second_kilogram: '1',
        first_cubic: '2',
        second_cubic: '2',
        price: '50'
      }, {
        id_delivery_price: '103',
        spot_or_range: '配送点价格',
        first_kilogram: '2',
        second_kilogram: '1',
        first_cubic: '2',
        second_cubic: '2',
        price: '50'
      }, {
        id_delivery_price: '104',
        spot_or_range: '配送点价格',
        first_kilogram: '2',
        second_kilogram: '1',
        first_cubic: '2',
        second_cubic: '2',
        price: '50'
      }]
    }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    }
  }
}
</script>

<style scoped>
   .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
