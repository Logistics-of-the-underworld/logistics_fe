<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.id_line" placeholder="路线ID" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.start_distribution" placeholder="起始点站点ID" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.end_distribution" placeholder="终点配送点ID" style="width: 180px;margin-right:25px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleCreate">
        新建
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column align="center" label="路线ID" width="180px">
        <template slot-scope="{row}">
          <span>{{ row.id_line }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="起始配送站点ID">
        <template slot-scope="{row}">
          <span>{{ row.start_distribution }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="终点配送站点ID">
        <template slot-scope="{row}">
          <span>{{ row.end_distribution }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="起点经度">
        <template slot-scope="{row}">
          <span>{{ row.start_longitude }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="起点纬度">
        <template slot-scope="{row}">
          <span>{{ row.start_latitude }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="终点经度">
        <template slot-scope="{row}">
          <span>{{ row.end_longitude }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="终点纬度">
        <template slot-scope="{row}">
          <span>{{ row.end_latitude }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="运费">
        <template slot-scope="{row}">
          <span>{{ row.cost }}</span>
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="路线ID" prop="id_line">
          <el-input v-model="temp.id_line" :disabled="'update' === dialogStatus" />
        </el-form-item>
        <el-form-item label="起始配送站点ID" prop="start_distribution">
          <el-input v-model="temp.start_distribution" :disabled="'update' === dialogStatus" />
        </el-form-item>
        <el-form-item label="终点配送站点ID" prop="end_distribution">
          <el-input v-model="temp.end_distribution" :disabled="'update' === dialogStatus" />
        </el-form-item>
        <el-form-item label="起点经度" prop="start_longitude">
          <el-input v-model="temp.start_longitude" />
        </el-form-item>
        <el-form-item label="起点纬度" prop="start_latitude">
          <el-input v-model="temp.start_latitude" />
        </el-form-item>
        <el-form-item label="终点经度" prop="end_longitude">
          <el-input v-model="temp.end_longitude" />
        </el-form-item>
        <el-form-item label="终点纬度" prop="end_latitude">
          <el-input v-model="temp.end_latitude" />
        </el-form-item>
        <el-form-item label="运费" prop="cost">
          <el-input v-model="temp.cost" />
        </el-form-item>
        <el-form-item v-if="'update' === dialogStatus" label="负责司机" prop="driver_name">
          <el-input v-model="temp.driver_name" />
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
import { fetchList, addRoute, updateRoute, deleteRoute } from '../../api/route'

const dataTest = {
  items: [
    {
      id_line: '渝AE86', name_distribution: '老爹', start_longitude: 83.123456, start_latitude: 48.564562,
      end_longitude: 93.123456, end_latitude: 78.564562, driver_name: 'woziji',
      start_distribution: 'ABCDEGF', cost: 1, end_distribution: 'QWERTYYY123'
    }
  ],
  total: 1
}
export default {
  name: 'ViewsPage',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        // 起始点站点编码
        start_distribution: undefined,
        // 终点配送点编码
        end_distribution: undefined,
        // 路线ID
        id_line: undefined
      },
      // 临时窗口中的数据
      temp: {
        // 路线ID
        id_line: undefined,
        // 起点经度
        start_longitude: undefined,
        // 起点纬度
        start_latitude: undefined,
        // 终点经度
        end_longitude: undefined,
        // 终点纬度
        end_latitude: undefined,
        // 起始点站点编码
        start_distribution: undefined,
        // 终点配送点编码
        end_distribution: undefined,
        // 运费
        cost: undefined,
        // 负责司机
        driver_name: undefined
      },
      dialogStatus: '',
      dialogFormVisible: false,
      downloadLoading: false,
      textMap: {
        update: '路线详情',
        create: '新建路线'
      },
      rules: {
        id_line: [{ required: true, message: 'id_line is required', trigger: 'blur' }],
        driver_name: [{ required: true, message: 'driver_name is required', trigger: 'blur' }],
        start_distribution: [{ required: true, message: 'start_distribution is required', trigger: 'blur' }],
        end_distribution: [{ required: true, message: 'end_distribution is required', trigger: 'blur' }]
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          // addTruck(this.temp).then(res => {
          //   this.list.unshift(this.temp)
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: 'Success',
          //     message: 'Created Successfully',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
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
      return deleteRoute(row)
    },
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.temp = Object.assign({}, row) // copy obj
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateRoute(tempData).then(() => {
            const index = this.list.findIndex(v => v.id_license === this.temp.id_license)
            this.list.splice(index, 1, this.temp)
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
    },
    resetTemp() {
      this.temp = {
        // 路线ID
        id_line: undefined,
        // 起点经度
        start_longitude: undefined,
        // 起点纬度
        start_latitude: undefined,
        // 终点经度
        end_longitude: undefined,
        // 终点纬度
        end_latitude: undefined,
        // 起始点站点编码
        start_distribution: undefined,
        // 终点配送点编码
        end_distribution: undefined,
        // 运费
        cost: undefined
      }
    }
  }
}
</script>

<style scoped>
</style>
