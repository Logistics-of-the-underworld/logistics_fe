<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.idOrder" placeholder="订单编号" style="width: 175px;margin-right:5px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.idPackage" placeholder="封装货号" style="width: 175px;margin-right:10px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      border
      @cell-dblclick="EditTableColumn"
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
        width="340px"
      />
      <el-table-column
        prop="handover_spot"
        label="交接地"
        width="340px"
      >
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.handover_spot" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              取消
            </el-button>
          </template>
          <span v-else>{{ row.handover_spot }}</span>
        </template>
      </el-table-column>
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
      <el-table-column label="操作" width="170px">
        <template slot-scope="{row}">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="handleUpdate(row)"
          >
            完成
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="confirmEdit(row)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
export default {
  name: 'HandoverPage',
  directives: { waves },
  data() {
    return {
      // 查询条件
      listQuery: {
        page: 1,
        limit: 20,
        idOrder: undefined,
        idPackage: undefined
      },
      listLoading: false,
      tableData: [{
        id_order: '01010101',
        id_package: '11111111',
        stat_spot: '上海市普陀区金沙江路 1518 弄',
        handover_spot: '上海市普陀区金沙江路 1518 弄',
        receiver_name: 'lily',
        create_time: '2016-05-04',
        update_time: '2016-05-04',
        edit: false
      }, {
        id_order: '02020202',
        id_package: '22222222',
        stat_spot: '上海市普陀区金沙江路 1518 弄',
        handover_spot: '上海市普陀区金沙江路 1518 弄',
        receiver_name: 'lily',
        create_time: '2016-05-04',
        update_time: '2016-05-04',
        edit: false
      }, {
        id_order: '03030303',
        id_package: '33333333',
        stat_spot: '上海市普陀区金沙江路 1518 弄',
        handover_spot: '上海市普陀区金沙江路 1518 弄',
        receiver_name: 'lily',
        create_time: '2016-05-04',
        update_time: '2016-05-04',
        edit: false
      }, {
        id_order: '04040404',
        id_package: '44444444',
        stat_spot: '上海市普陀区金沙江路 1518 弄',
        handover_spot: '上海市普陀区金沙江路 1518 弄',
        receiver_name: 'lily',
        create_time: '2016-05-04',
        update_time: '2016-05-04',
        edit: false
      }],
      temp: {

      },
      tempEdit: {},
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    EditTableColumn(row, column, cell, event) {
      this.tempEdit.handover_spot = row.handover_spot
      row.edit = !row.edit
    },
    cancelEdit(row) {
      row.handover_spot = this.tempEdit.handover_spot
      row.edit = false
    },
    confirmEdit(row) {
      row.edit = true
    },
    handleUpdate(row) {
      row.edit = false
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['编号', '订单号', '下单用户', '创建时间', '配送地', '订单状态', '配送价格', '条形码', '寄件人姓名', '收件人姓名', '配送车辆', '支付方式',
          '用户评价', '备注', '审核人']
        const filterVal = ['idTpOrder', 'idOrder', 'username', 'createTime', 'senderAddress', 'stateOrder', 'deliveryPrice',
          'idBarCode', 'senderName', 'receiverName', 'idLicense', 'paymentMethod', 'importance', 'marks', 'reviewer']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    }
  }
}
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
