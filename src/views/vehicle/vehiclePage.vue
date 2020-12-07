<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.license" placeholder="车牌号" style="width: 100px;margin-right:12px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.type" placeholder="车辆型号" style="width: 100px;margin-right:12px" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-date-picker style="width: 130px;margin-right:12px" v-model="listQuery.timestamp" type="datetime" placeholder="请选择购置时间" />

      <el-select v-model="listQuery.state" placeholder="车辆状态" clearable class="filter-item" style="width: 130px;margin-right:12px">
        <el-option v-for="item in vehicleStateTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-if="JSON.parse(this.$store.getters.roles)[0].toString() === 'vehicleManager'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column align="center" label="车牌号">
        <template slot-scope="{row}">
          <span>{{ row.idLicense }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="购买日期">
        <template slot-scope="{row}">
          <span>{{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="驾驶员">
        <template slot-scope="{row}">
          <span>{{ row.driverName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="车辆型号">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="限载">
        <template slot-scope="{row}">
          <span>{{ row.limitKilogram }}kg</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="限容">
        <template slot-scope="{row}">
          <span>{{ row.limitVolume }}m³</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="车辆状态">
        <template slot-scope="{row}">
          <el-tag :type="row.state | statusFilter">
            {{ vehicleStateTypeKeyValue[row.state] }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
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
        <el-form-item label="车牌号">
          <el-input v-model="temp.idLicense" :disabled="!(JSON.parse(this.$store.getters.roles)[0].toString() === 'vehicleManager')" />
        </el-form-item>
        <el-form-item label="购买日期">
          <el-date-picker v-model="temp.createTime" type="datetime" placeholder="Please pick a date" :disabled="!(JSON.parse(this.$store.getters.roles)[0].toString() === 'vehicleManager')" />
        </el-form-item>
        <el-form-item label="车辆状态">
          <el-select v-model="temp.state" class="filter-item" placeholder="Please select">
            <el-option v-for="item in vehicleStateTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="车辆型号" prop="type">
          <el-input v-model="temp.type" />
        </el-form-item>
        <el-form-item label="驾驶员姓名" prop="driverName">
          <el-input v-model="temp.driverName" />
        </el-form-item>
        <el-form-item label="限载" prop="limitKilogram">
          <el-input v-model="temp.limitKilogram" />
        </el-form-item>
        <el-form-item label="限容" prop="limitVolume">
          <el-input v-model="temp.limitVolume" />
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
import { addTruck, deleteTruck, fetchList, getVehicleByOrg, updateTruck } from '@/api/vehicle'
// eslint-disable-next-line no-unused-vars
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
        idLicense: undefined,
        createTime: undefined,
        driverName: '',
        limitVolume: undefined,
        limitKilogram: undefined,
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
        driverName: [{ required: true, message: '司机姓名不能为空', trigger: 'blur' }],
        limitKilogram: [{ required: true, message: '请设置最大载重量', trigger: 'blur' }],
        limitVolume: [{ required: true, message: '请设置最大运输体积', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.listLoading = true

      fetchList({ page: this.listQuery.page, limit: this.listQuery.limit,
        id_license: this.listQuery.license, type: this.listQuery.type,
        create_time: this.listQuery.timespan, state: this.listQuery.state,
        org: this.$store.getters.organizationName }).then(resp => {
        this.list = resp.date
        this.total = resp.total
      })

      this.listLoading = false
    },
    async getList() {
      this.listLoading = true
      getVehicleByOrg({ org: this.$store.getters.organizationName, current: this.listQuery.page, size: this.listQuery.limit }).then(resp => {
        this.list = resp.vehicleList
        this.total = resp.total
      })
      this.listLoading = false
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
      this.deleteData(row).then(res => {
        if (res.code === 20000) {
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        }
      })
    },
    deleteData(row) {
      return deleteTruck({ idLicense: row.idLicense })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addTruck({ vehicle: JSON.stringify(this.temp), org: this.$store.getters.organizationName }).then(res => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateTruck({ vehicle: JSON.stringify(tempData) }).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
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
    },
    resetTemp() {
      this.temp = {
        idLicense: undefined,
        createTime: undefined,
        driverName: '',
        limitVolume: undefined,
        limitKilogram: undefined,
        type: '',
        status: undefined
      }
    }
  }
}
</script>

<style scoped>
</style>
