<template>
  <div class="app-container" style="height: 100%">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column align="center" label="用户名">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户昵称">
        <template slot-scope="{row}">
          <span>{{ row.petname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系方式">
        <template slot-scope="{row}">
          <span v-if="row.phone != undefined && row.phone.length > 0">{{ row.phone }}</span>
          <span v-if="row.email != undefined && row.email.length > 0">{{ row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="用户激活状态"
        :filters="[{ text: '已入职', value: '0' }, { text: '待确认', value: '1' }, { text: '已拒绝', value: '2'}]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
        <template slot-scope="{row}">
          <span v-if="row.ban.toString() === '0'">已入职</span>
          <span v-if="row.ban.toString() === '1'">待确认</span>
          <span v-if="row.ban.toString() === '2'">已拒绝</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户权限">
        <template slot-scope="{row}">
          <span>{{ row.role.note }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="260px">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            更换权限
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            离职处理
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="权限更换" :visible.sync="dialogFormVisible" center width="500px">

      <el-select v-model="value" placeholder="请选择" style="margin-left: 120px">
        <el-option
          v-for="item in options"
          :key="item.idTbRole"
          :label="item.note"
          :value="item.idTbRole">
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确认
        </el-button>
      </div>

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
import { fetchList, addRoute, updateRoute, deleteRoute } from '../../api/route'
import { changeRole, deleteAuth, getAuth, getAuthByOrg, getByOrgStandBy, getRoleByIdentity } from '@/api/user'

export default {
  name: 'ViewsPage',
  components: { Pagination },
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
        start_distribution: undefined,
        // 终点配送点编码
        end_distribution: undefined,
        // 路线ID
        id_line: undefined
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
      flag: false,
      refluse: false
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
      if (JSON.parse(this.$store.getters.roles)[0].toString() === 'admin') {
        await getAuth(this.listQuery.limit, this.listQuery.page).then(resp => {
          this.list = resp.userList
          this.total = resp.total
        })
        this.listLoading = false
      } else {
        await getAuthByOrg(this.$store.getters.organizationName, this.listQuery.limit, this.listQuery.page).then(resp => {
          this.list = resp.userList
          this.total = resp.total
        })
        await getRoleByIdentity().then(resp => {
          this.options = resp.role
        })
        this.listLoading = false
      }
    },
    deleteUser() {
      deleteAuth({ 'targetUsername': this.tempRow.username, 'note': this.reason }).then(resp => {
        this.deleteFlag = false
        this.$message.success('解聘成功')
        this.getList()
      })
    },
    filterTag(value, row) {
      return row.ban === value
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
      this.deleteFlag = true
      this.tempRow = row
    },
    deleteData(row) {
      return deleteRoute(row)
    },
    handleUpdate(row) {
      this.tempRow = row
      this.dialogFormVisible = true
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
