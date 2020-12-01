<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.license" placeholder="车牌号" style="width: 100px;margin-right:12px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.type" placeholder="车辆型号" style="width: 100px;margin-right:12px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input label="Date" prop="timestamp" style="width: 130px;margin-right:12px" placeholder="请选择购置时间">
        <el-date-picker v-model="listQuery.timestamp" type="datetime" />
      </el-input>
      <el-select v-model="listQuery.state" placeholder="车辆状态" clearable class="filter-item" style="width: 130px;margin-right:12px">
        <el-option v-for="item in vehicleStateTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
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
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 1011px;">
      <el-table-column align="center" label="车牌号" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.id_license }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="购买日期">
        <template slot-scope="{row}">
          <span>{{ row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="驾驶员">
        <template slot-scope="{row}">
          <span>{{ row.driver_name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="车辆型号">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="限载">
        <template slot-scope="{row}">
          <span>{{ row.limit_kilogram }}kg</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="限容">
        <template slot-scope="{row}">
          <span>{{ row.limit_volume }}m³</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="车辆状态" width="110px">
        <template slot-scope="{row}">
          <el-tag :type="row.state | statusFilter">
            {{ row.state }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="160px">
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
        <el-form-item label="车牌号" prop="id_license">
          <el-input v-model="temp.id_license" disabled />
        </el-form-item>
        <el-form-item label="购买日期" prop="create_time">
          <el-date-picker v-model="temp.create_time" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="车辆状态">
          <el-select v-model="temp.state" class="filter-item" placeholder="Please select">
            <el-option v-for="item in vehicleStateTypeKeyValue" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="车辆型号" prop="type">
          <el-input v-model="temp.type" />
        </el-form-item>
        <el-form-item label="驾驶员姓名" prop="driver_name">
          <el-input v-model="temp.driver_name" />
        </el-form-item>
        <el-form-item label="限载" prop="limit_kilogram">
          <el-input v-model="temp.limit_kilogram" />
        </el-form-item>
        <el-form-item label="限容" prop="limit_volume">
          <el-input v-model="temp.limit_volume" />
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
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { addTruck, deleteTruck, updateTruck } from '@/api/vehicle'
const dataTest = {
  items: [
    {
      id_license: '渝AE86', create_time: '1998-08-01 07:42', driver_name: '老爹', type: '小卡车', state: 0,
      limit_kilogram: 5.2, limit_volume: 18.2
    }
  ],
  total: 1
}
const vehicleStateTypeOptions = [
  { key: 0, display_name: '空闲' },
  { key: 1, display_name: '繁忙' },
  { key: 2, display_name: '停用' }
]
const vehicleStateTypeKeyValue = vehicleStateTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  name: 'VehiclePage',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '空闲': 'success',
        '繁忙': 'info',
        '停用': 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogFormVisible: false,
      vehicleStateTypeKeyValue,
      vehicleStateTypeOptions,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        license: undefined,
        type: undefined,
        timespan: undefined,
        state: undefined
      },
      // 临时窗口中的数据
      temp: {
        id_license: undefined,
        create_time: undefined,
        driver_name: '',
        timestamp: new Date(),
        limit_volume: undefined,
        limit_kilogram: undefined,
        type: '',
        status: undefined
      },
      dialogStatus: '',
      downloadLoading: false,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        driver_name: [{ required: true, message: 'driver_name is required', trigger: 'blur' }],
        limit_kilogram: [{ required: true, message: 'limit_kilogram is required', trigger: 'blur' }],
        limit_volume: [{ required: true, message: 'limit_volume is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    async getList() {
      this.listLoading = true
      const data = dataTest
      const items = data.items
      this.total = data.total
      this.list = items.map(v => {
        v.state = vehicleStateTypeKeyValue[v.state]
        // this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        return v
      })
      this.listLoading = false
      console.log(this.list)
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.temp = Object.assign({}, row) // copy obj
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
    deleteData(row) {
      return deleteTruck(row)
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          addTruck(this.temp).then(res => {
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
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateTruck(tempData).then(() => {
            const index = this.list.findIndex(v => v.id_license === this.temp.id_license)
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
</style>
