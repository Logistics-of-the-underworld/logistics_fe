<template>
  <div class="app-container" style="height: 100%">
    <div class="filter-container">
      <el-input v-model="listQuery.idCompany" placeholder="公司编号" style="width: 180px;margin-right:12px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.nameCompany" placeholder="公司名" style="width: 180px;margin-right:12px" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column align="center" label="公司编号">
        <template slot-scope="{row}">
          <span>{{ row.idCompany }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="公司名">
        <template slot-scope="{row}">
          <span>{{ row.nameCompany }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="{row}">
          <span>{{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="公司具备的配送点数量">
        <template slot-scope="{row}">
          <span>{{ row.disTotal }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="260px">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            委派管理者
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            移出集团
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="委派管理者" :visible.sync="dialogFormVisible" center width="600px">

      <add-user-page :org="orgname"/>

    </el-dialog>

    <el-dialog title="离职原因填写" :visible.sync="deleteFlag" center width="500px">

      <el-input v-model="reason" placeholder="请输入内容" style="width: 300px;margin-left: 85px"></el-input>

      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteFlag = false">
          取消
        </el-button>
        <el-button type="primary" @click="deleteUser()">
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
import addUserPage from '@/views/user/addUserPage'
import { fetchList, addRoute, updateRoute, deleteRoute } from '../../api/route'
import { changeRole, deleteAuth, getAuth, getAuthByOrg, getRoleByIdentity } from '@/api/user'
import { deleteCompany, getCompany } from '@/api/company'

export default {
  name: 'CompanyPage',
  components: { Pagination, addUserPage },
  directives: { waves },
  data() {
    return {
      value: '',
      list: null,
      deleteFlag: false,
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        // 起始点站点编码
        idCompany: undefined,
        // 终点配送点编码
        nameCompany: undefined
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
      },
      options: [],
      tempRow: undefined,
      reason: undefined,
      orgname: undefined
    }
  },
  created() {
    this.getList()
    this.getRoleList()
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    async getList() {
      this.listLoading = true

      getCompany(this.listQuery).then(resp => {
        this.list = resp.data
        this.total = resp.total
      })

      this.listLoading = false
    },
    async getRoleList() {
      getRoleByIdentity().then(resp => {
        this.options = resp.role
      })
    },
    deleteUser() {
      deleteAuth({ 'targetUsername': this.tempRow.username, 'note': this.reason }).then(resp => {
        this.deleteFlag = false
        this.$message.success('解聘成功')
        this.getList()
      })
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
    handleDelete(row) {
      deleteCompany(row.idCompany).then(resp => {
        this.$message.success('操作成功！')
        this.getList()
      })
    },
    deleteData(row) {
      return deleteRoute(row)
    },
    handleUpdate(row) {
      this.tempRow = row
      this.dialogFormVisible = true
      this.orgname = row.nameCompany
    },
    updateData() {
      changeRole({ 'roleId': this.value, 'targetUser': this.tempRow.idTbUser }).then(resp => {
        this.dialogFormVisible = false
        this.$message.success('修改成功！')
        this.getList()
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
