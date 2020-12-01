<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="收寄地" style="width: 200px;margin-right:12px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="用户评价" clearable style="width: 120px;margin-right:12px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="订单状态" clearable class="filter-item" style="width: 130px;margin-right:12px">
        <el-option v-for="item in orderStateTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px;margin-right:12px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;margin-right:12px" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox>
    </div>
    <div class="table-list-main">
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
        <el-table-column label="订单编号" prop="id_order" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
          <template slot-scope="{row}">
            <span>{{ row.id_order }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="配送点名称" width="110px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.name_distribution }}</span>
          </template>
        </el-table-column>
        <el-table-column label="寄件人姓名" width="110px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.sender_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收件人姓名" width="110px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.receiver_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="配送价格" width="110px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.delivery_price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="评价" width="80px">
          <template slot-scope="{row}">
            <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
          </template>
        </el-table-column>
        <el-table-column label="订单状态" align="center" width="95">
          <template slot-scope="{row}">
            <el-tag :type="row.state_order | statusFilter">
              {{ row.state_order }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">
          <template slot-scope="{row}">
            <span style="color:red;">{{ row.reviewer }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              查看
            </el-button>
            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
              取消订单
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="订单编号" prop="id_order">
          <el-input v-model="temp.id_order" />
        </el-form-item>
        <el-form-item label="下单时间" prop="create_time">
          <el-date-picker v-model="temp.create_time" type="datetime" placeholder="Please pick a date" disabled />
        </el-form-item>
        <el-form-item label="配送时间" prop="delivery_time">
          <el-input v-model="temp.delivery_time" />
        </el-form-item>
        <el-form-item label="配送点名称" prop="name_distribution">
          <el-input v-model="temp.name_distribution" />
        </el-form-item>
        <el-form-item label="条形码" prop="bar_code_url">
          <el-input v-model="temp.bar_code_url" />
        </el-form-item>
        <el-form-item label="寄件人姓名" prop="sender_name">
          <el-input v-model="temp.sender_name" disabled />
        </el-form-item>
        <el-form-item label="寄件人电话" prop="sender_phone">
          <el-input v-model="temp.sender_phone" disabled />
        </el-form-item>
        <el-form-item label="收件人姓名" prop="receiver_name">
          <el-input v-model="temp.receiver_name" />
        </el-form-item>
        <el-form-item label="收件人电话" prop="receiver_phone">
          <el-input v-model="temp.receiver_phone" />
        </el-form-item>
        <el-form-item label="配送车辆" prop="id_license">
          <el-input v-model="temp.id_license" />
        </el-form-item>
        <el-form-item label="订单状态" prop="state_order">
          <el-input v-model="temp.state_order" />
        </el-form-item>
        <el-form-item label="配送人" prop="courier">
          <el-input v-model="temp.courier" />
        </el-form-item>
        <el-form-item label="配送人电话" prop="courier_phone">
          <el-input v-model="temp.courier_phone" />
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
          保存
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

const orderTest = {
  items: [
    {
      id_order: 'zxc123456', name_distribution: '灵力药房', bar_code_url: '/asdkjhajkfasf.jpg', state_order: 6,
      sender_name: '我急了', sender_phone: 15023421665, receiver_name: '我装的', receiver_phone: '110',
      delivery_price: '18.00', insurance_fee: '0.00', delivery_time: '2020-11-27 16:04', id_license: '渝AE86',
      courier: '陈快递', courier_phone: '12580', marks: '这里是备注', create_time: '1998-08-01 07:42', importance: 3,
      reviewer: '熊洪伟'
    }
  ],
  total: 1
}

const orderStateTypeOptions = [
  { key: 0, display_name: '未处理' },
  { key: 1, display_name: '审核通过' },
  { key: 2, display_name: '在途中' },
  { key: 3, display_name: '在配送中' },
  { key: 4, display_name: '已签收' },
  { key: 5, display_name: '等待支付' },
  { key: 6, display_name: '已完成' },
  { key: 7, display_name: '退订' }
]
const orderStateTypeKeyValue = orderStateTypeOptions.reduce((acc, cur) => {
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
      orderStateTypeOptions,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id_order: undefined,
        name_distribution: '',
        bar_code_url: undefined,
        importance: 1,
        sender_name: '',
        sender_phone: undefined,
        receiver_name: '',
        receiver_phone: undefined,
        create_time: undefined,
        timestamp: new Date(),
        delivery_time: undefined,
        id_license: undefined,
        state_order: undefined,
        courier: '',
        courier_phone: undefined,
        marks: ''
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
        id_license: [{ required: true, message: 'id_license is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        receiver_name: [{ required: true, message: 'receiver_name is required', trigger: 'blur' }],
        receiver_phone: [{ required: true, message: 'receiver_phone is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      console.log(this.listQuery)
      this.listLoading = true
      const data = orderTest
      const items = data.items
      this.total = data.total
      this.list = items.map(v => {
        v.state_order = orderStateTypeKeyValue[v.state_order]
        return v
      })
      this.listLoading = false
      console.log(this.listQuery.importance)
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
        id_order: undefined,
        name_distribution: '',
        bar_code_url: undefined,
        importance: 1,
        sender_name: '',
        sender_phone: undefined,
        receiver_name: '',
        receiver_phone: undefined,
        create_time: undefined,
        timestamp: new Date(),
        delivery_time: undefined,
        id_license: undefined,
        state_order: undefined,
        courier: '',
        courier_phone: undefined,
        marks: ''
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
<style scoped>
  .table-list-main {
    width: auto;
  }
</style>
