<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="收寄地" style="width: 170px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.id_distribution" placeholder="配送地" style="width: 170px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.receiver_name" placeholder="客户姓名" style="width: 110px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.state_order" placeholder="订单状态" clearable class="filter-item" style="width: 100px">
        <el-option v-for="item in orderStateOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.timespan" placeholder="查询时段" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in timeSpanOption" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
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
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单日期" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单号" min-width="150px">
        <template slot-scope="{row}">
          <el-tag>{{ row.id_order | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="审核人" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.state_order | statusFilter">
            {{ row.state_order }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column width="120px" align="center" label="条形码">
        <template slot-scope="{row}">
          <span>{{ row.bar_code_url }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="寄件人姓名">
        <template slot-scope="{row}">
          <span>{{ row.sender_name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="收件人姓名">
        <template slot-scope="{row}">
          <span>{{ row.receiver_name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="配送价格">
        <template slot-scope="{row}">
          <span>{{ row.delivery_price }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="配送车辆">
        <template slot-scope="{row}">
          <span>{{ row.id_license }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="支付方式">
        <template slot-scope="{row}">
          <span>{{ row.payment_method }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="用户评价" width="80px">
        <template slot-scope="{row}">
          <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="订单号" prop="id_order">
          <el-select v-model="temp.id_order" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="下单日期" prop="create_time">
          <el-date-picker v-model="temp.create_time" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="temp.state_order" class="filter-item" placeholder="Please select">
            <el-option v-for="item in orderStateTypeKeyValue" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="条形码" prop="bar_code_url">
          <el-input v-model="temp.bar_code_url" />
        </el-form-item>
        <el-form-item label="寄件人姓名" prop="sender_name">
          <el-input v-model="temp.sender_name" />
        </el-form-item>
        <el-form-item label="收件人姓名" prop="receiver_name">
          <el-input v-model="temp.receiver_name" />
        </el-form-item>
        <el-form-item label="配送价格" prop="delivery_price">
          <el-input v-model="temp.delivery_price" />
        </el-form-item>
        <el-form-item label="配送车辆" prop="id_license">
          <el-input v-model="temp.id_license" />
        </el-form-item>
        <el-form-item label="支付方式" prop="payment_method">
          <el-input v-model="temp.payment_method" />
        </el-form-item>
        <el-form-item label="用户评价">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.marks" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const dataTest = { // eslint-disable-line no-unused-vars
  items: [
    {
      id: '007', create_time: '1998-08-01 07:42', id_order: '0909709099', state_order: '未处理', importance: '2', bar_code_url: '121212111', sender_name: 'lily',
      receiver_name: 'tom', delivery_price: '200', id_license: '111111', payment_method: '微信', marks: '感觉还可以'
    }
  ],
  total: 1
}

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

const timeSpanOption = [
  { key: 'morning', display_name: '9:00 - 12:00' },
  { key: 'afternoon', display_name: '13:30 - 17:30' },
  { key: 'evening', display_name: '19:00 - 21:30' }
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
        published: 'success',
        draft: 'info',
        deleted: 'danger'
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
        title: undefined,
        id_distribution: undefined,
        sort: '+id',
        state_order: '',
        receiver_name: ''
      },
      importanceOptions: [1, 2, 3],
      // 三个下拉框选项
      timeSpanOption,
      orderStateOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      orderStateTypeKeyValue,
      showReviewer: false,
      // 临时窗口中的数据
      temp: {
        id: undefined,
        create_time: '',
        id_order: '',
        reviewer: undefined,
        state_order: '',
        bar_code_url: undefined,
        sender_name: undefined,
        receiver_name: undefined,
        delivery_price: undefined,
        id_license: undefined,
        payment_method: undefined,
        importance: undefined,
        marks: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.listLoading = false
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.list = dataTest.items
      this.total = dataTest.total
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
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
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
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
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
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
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
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
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
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
