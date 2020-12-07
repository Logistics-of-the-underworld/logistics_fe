<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.receiverAddress" placeholder="收寄地" style="width: 170px;margin-right:12px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.senderAddress" placeholder="配送地" style="width: 170px;margin-right:12px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.receiverName" placeholder="收件人" style="width: 110px;margin-right:12px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.stateOrder" placeholder="订单状态" clearable class="filter-item" style="width: 120px;margin-right:12px">
        <el-option v-for="item in orderStateOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        查看审核人
      </el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="idTpOrder" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.idTpOrder }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单日期" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单号" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.idOrder }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单用户" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="配送地" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.senderAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收寄地" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.receiverAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="审核人" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.stateOrder | statusFilter">
            {{ orderStateTypeKeyValue[row.stateOrder] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="用户评价" width="80px">
        <template slot-scope="{row}">
          <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            查看
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="width: 400px; margin-left:50px;">
        <el-form-item label="寄件人姓名" prop="senderName">
          <el-input v-model="temp.senderName" disabled/>
        </el-form-item>
        <el-form-item label="收件人姓名" prop="receiverName">
          <el-input v-model="temp.receiverName" disabled/>
        </el-form-item>
        <el-form-item label="配送价格" prop="deliveryPrice">
          <el-input v-model="temp.deliveryPrice" disabled/>
        </el-form-item>
        <el-form-item label="支付方式" prop="paymentMethod">
          <el-input v-model="temp.paymentMethod" disabled />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="temp.stateOrder" class="filter-item" placeholder="Please select">
            <el-option v-for="item in orderStateOptions" :key="item.display_name" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="1 <= temp.stateOrder" label="条形码" prop="barCodeUrl">
          <el-image :src="temp.barCodeUrl">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </el-form-item>
        <el-form-item label="配送车辆" prop="idLicense">
          <el-input v-model="temp.idLicense" />
        </el-form-item>
        <el-form-item label="配送站点编号" prop="idDistribution">
          <el-input v-model="temp.idDistribution" />
        </el-form-item>
        <el-form-item label="审核人" prop="reviewer">
          <el-input v-model="temp.reviewer" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPv } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { fetchList, updateOrder, deleteOrder } from '@/api/orderManage'

const orderStateOptions = [
  { key: 0, display_name: '未处理' },
  { key: 1, display_name: '审核通过' },
  { key: 2, display_name: '在途中' },
  { key: 3, display_name: '在配送中' },
  { key: 4, display_name: '已签收' },
  { key: 5, display_name: '等待支付' },
  { key: 6, display_name: '已完成' },
  { key: 7, display_name: '退订' }
]

// const timeSpanTypeKeyValue = timeSpanOption.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name
//   return acc
// }, {})

const orderStateTypeKeyValue = orderStateOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '未处理': 'info',
        '审核通过': 'success',
        '在途中': 'success',
        '在配送中': 'success',
        '已签收': 'success',
        '等待支付': 'success',
        '已完成': 'success',
        '退订': 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      // 查询条件
      listQuery: {
        page: 1,
        limit: 20,
        senderAddress: undefined,
        receiverAddress: undefined,
        stateOrder: undefined,
        receiverName: undefined
      },
      importanceOptions: [1, 2, 3],
      orderStateOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      orderStateTypeKeyValue,
      showReviewer: false,
      // 临时窗口中的数据
      temp: {
        idTpOrder: undefined,
        idOrder: '',
        idDistribution: undefined,
        barCodeUrl: undefined,
        reviewer: undefined,
        stateOrder: '',
        senderName: undefined,
        receiverName: undefined,
        deliveryPrice: undefined,
        idLicense: undefined,
        paymentMethod: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '订单详细'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        idDistribution: [{ required: true, message: '配送点编号是必须的', trigger: 'blur' }],
        reviewer: [{ required: true, message: '审核人是必须的', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.listLoading = false
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      await fetchList(this.listQuery).then(res => {
        this.total = res.total
        this.list = res.data
        this.list = this.list.map(v => {
          v.createTime = this.dayjs(v.createTime).format('YYYY-MM-DD HH:mm')
          return v
        })
      })
      console.log(this.list)
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateOrder({ order: tempData }).then(() => {
            const index = this.list.findIndex(v => v.idTpOrder === this.temp.idTpOrder)
            this.list.splice(index, 1, tempData)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.deleteData(row).then(res => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    },
    deleteData(row) {
      return deleteOrder(row.idOrder)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
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
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'createTime') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
