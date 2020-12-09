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
    <el-table v-loading="listLoading" :data="list" fit highlight-current-row style="width: 100%;">
      <el-table-column align="center" label="路线ID" >
        <template slot-scope="{row}">
          <span>{{ row.idLine }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="起始配送站点ID">
        <template slot-scope="{row}">
          <span>{{ row.startDistribution }}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="终点配送站点ID">
        <template slot-scope="{row}">
          <span>{{ row.endDistribution }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="起点经度">
        <template slot-scope="{row}">
          <span>{{ row.startLongitude }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="起点纬度">
        <template slot-scope="{row}">
          <span>{{ row.startLatitude }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="终点经度">
        <template slot-scope="{row}">
          <span>{{ row.endLongitude }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="终点纬度">
        <template slot-scope="{row}">
          <span>{{ row.endLatitude }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="运费">
        <template slot-scope="{row}">
          <span>{{ row.cost }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" >
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
        <el-form-item label="路线ID" prop="idLine">
          <el-input v-model="temp.idLine" :disabled="'update' === dialogStatus" />
        </el-form-item>
        <el-form-item label="起始配送站点ID" prop="startDistribution">
          <el-input v-model="temp.startDistribution" :disabled="'update' === dialogStatus" />
        </el-form-item>
        <el-form-item label="终点配送站点ID" prop="endDistribution">
          <el-input v-model="temp.endDistribution" :disabled="'update' === dialogStatus" />
        </el-form-item>
        <el-form-item label="起点经度" prop="startLongitude">
          <el-input v-model="temp.startLongitude" />
        </el-form-item>
        <el-form-item label="起点纬度" prop="startLatitude">
          <el-input v-model="temp.startLatitude" />
        </el-form-item>
        <el-form-item label="终点经度" prop="endLongitude">
          <el-input v-model="temp.endLongitude" />
        </el-form-item>
        <el-form-item label="终点纬度" prop="endLatitude">
          <el-input v-model="temp.endLatitude" />
        </el-form-item>
        <el-form-item v-if="'update' === dialogStatus" label="负责司机" prop="driverName">
          <el-input v-model="temp.driverName" />
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
        idLline: undefined,
        // 起点经度
        startLongitude: undefined,
        // 起点纬度
        startLatitude: undefined,
        // 终点经度
        endLongitude: undefined,
        // 终点纬度
        endLatitude: undefined,
        // 起始点站点编码
        startDistribution: undefined,
        // 终点配送点编码
        endDistribution: undefined,
        // 运费
        cost: undefined,
        // 负责司机
        driverName: undefined
      },
      dialogStatus: '',
      dialogFormVisible: false,
      downloadLoading: false,
      textMap: {
        update: '路线详情',
        create: '新建路线'
      },
      rules: {
        idLine: [{ required: true, message: '路线ID是必须的', trigger: 'blur' }],
        driverName: [{ required: true, message: '司机是必须的', trigger: 'blur' }],
        startDistribution: [{ required: true, message: '起始站点ID是必须的', trigger: 'blur' }],
        endDistribution: [{ required: true, message: '终点站点ID是必须的', trigger: 'blur' }],
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
      await fetchList(this.listQuery).then(res => {
        this.total = res.total
        this.list = res.data
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addRoute(this.temp).then(res => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleDelete(row, index) {
      this.deleteData(row).then(res => {
        if (res.code === 20000) {
          this.$notify({
            title: 'Success',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        }
      })
    },
    deleteData(row) {
      return deleteRoute(row.idLine)
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
          updateRoute({ lineInfo: tempData }).then(() => {
            const index = this.list.findIndex(v => v.idLline === this.temp.idLline)
            this.list.splice(index, 1, this.temp)
            this.$notify({
              title: 'Success',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
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
        idLine: undefined,
        // 起点经度
        startLongitude: undefined,
        // 起点纬度
        startLatitude: undefined,
        // 终点经度
        endLongitude: undefined,
        // 终点纬度
        endLatitude: undefined,
        // 起始点站点编码
        startDistribution: undefined,
        // 终点配送点编码
        endDistribution: undefined,
        // 运费
        cost: undefined
      }
    }
  }
}
</script>

<style scoped>
</style>
