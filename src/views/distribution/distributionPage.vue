<template>
  <div>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      lazy
      @cell-dblclick="EditTableColumn"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="管理员代码">
              <span>{{ props.row.idAdmin }}</span>
            </el-form-item>
            <el-form-item label="管理员口令">
              <span>{{ props.row.passwordAdmin }}</span>
            </el-form-item>
            <el-form-item label="内部结算价格">
              <span>{{ props.row.innerPrice }}</span>
            </el-form-item>
            <el-form-item label="上行站点">
              <span>{{ props.row.upDistributions }}</span>
            </el-form-item>
            <el-form-item label="下行站点">
              <span>{{ props.row.downDistributions }}</span>
            </el-form-item>
            <el-form-item label="是否为主站点">
              <span>{{ props.row.isMainDistribution }}</span>
            </el-form-item>
            <el-form-item label="相关主站点">
              <span>{{ props.row.concernedMainDistribution }}</span>
            </el-form-item>
            <el-form-item label="经度">
              <span>{{ props.row.longitude }}</span>
            </el-form-item>
            <el-form-item label="纬度">
              <span>{{ props.row.latitude }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="配送点编码"
        prop="idDistribution"
        :index="0"
      />
      <el-table-column
        label="配送点名称"
        prop="nameDistribution"
        :index="1"
      >
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.nameDistribution" class="edit-input" size="small" />
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
          <span v-else>{{ row.nameDistribution }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="所属公司"
        prop="nameCompany"
        :index="2"
      >
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.nameCompany" class="edit-input" size="small" />
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
          <span v-else>{{ row.nameCompany }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
        :index="3"
      />
      <el-table-column
        label="更新时间"
        prop="updateTime"
        :index="4"
      />
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)"
          >
            完成
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="handleUpdate(row)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="配送点编码" prop="idDistribution">
          <el-input v-model="temp.idDistribution" :disabled="'update' === dialogStatus" />
        </el-form-item>
        <el-form-item label="管理员代码" prop="idAdmin">
          <el-input v-model="temp.idAdmin" />
        </el-form-item>
        <el-form-item label="管理员口令" prop="passwordAdmin">
          <el-input v-model="temp.passwordAdmin" />
        </el-form-item>
        <el-form-item label="内部结算价格" prop="innerPrice">
          <el-input v-model="temp.innerPrice" />
        </el-form-item>
        <el-form-item label="上行站点" prop="upDistributions">
          <el-input v-model="temp.upDistributions" />
        </el-form-item>
        <el-form-item label="下行站点" prop="downDistributions">
          <el-input v-model="temp.downDistributions" />
        </el-form-item>
        <el-form-item label="是否为主站点" prop="isMainDistribution">
          <el-input v-model="temp.isMainDistribution" />
        </el-form-item>
        <el-form-item label="相关主站点" prop="concernedMainDistribution">
          <el-input v-model="temp.concernedMainDistribution" />
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="temp.longitude" />
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="temp.latitude" />
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
import { fetchList, deleteDistribution, updateDistribution, addDistribution } from '../../api/distribution'
import { mapGetters } from 'vuex'
export default {
  name: 'DistributionPage',
  data() {
    return {
      loading: true,
      name_company: undefined,
      id_distribution: undefined,
      tableData: [],
      tempEdit: {},
      temp: {
        idDistribution: undefined,
        idAdmin: undefined,
        passwordAdmin: undefined,
        innerPrice: undefined,
        upDistributions: undefined,
        downDistributions: undefined,
        isMainDistribution: undefined,
        concernedMainDistribution: undefined,
        longitude: undefined,
        latitude: undefined
      },
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: '配送站点详情',
        create: '新建配送站点'
      },
      rules: {
        longitude: [{ required: true, message: 'longitude is required', trigger: 'blur' }],
        latitude: [{ required: true, message: 'latitude is required', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters({
      roles: 'roles'
    })
  },
  created() {
    this.getDistribution()
    console.log(123)
  },
  methods: {
    EditTableColumn(row, column, cell, event) {
      this.tempEdit.nameCompany = row.nameCompany
      this.tempEdit.nameDistribution = row.nameDistribution
      row.edit = !row.edit
    },
    cancelEdit(row) {
      row.nameCompany = this.tempEdit.nameCompany
      row.nameDistribution = this.tempEdit.nameDistribution
      row.edit = false
    },
    confirmEdit(row) {
      row.edit = false
      row.updateTime = this.dayjs(new Date()).format('YYYY-MM-DD')
      updateDistribution({ distribution: row }).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      })
    },
    async getDistribution() {
      this.loading = true
      let parmas
      if (JSON.parse(this.roles)[1] === 'admin') {
        parmas = this.$store.getters.organizationName
      }
      console.log(parmas)
      await fetchList(parmas || 'no').then(res => {
        this.tableData = res.data
        this.tableData = this.tableData.map(v => {
          v.createTime = this.dayjs(v.createTime).format('YYYY-MM-DD')
          v.updateTime = this.dayjs(v.updateTime).format('YYYY-MM-DD')
          this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
          return v
        })
      })
      this.loading = false
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
          this.tableData.splice(index, 1)
        }
      })
    },
    deleteData(row) {
      return deleteDistribution(row.idDistribution)
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
          addDistribution(this.temp).then(res => {
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
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.temp = Object.assign({}, row) // copy obj
      console.log(this.temp)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          updateDistribution({ distribution: tempData }).then(() => {
            const index = this.tableData.findIndex(v => v.idDistribution === this.temp.idDistribution)
            this.tableData.splice(index, 1, this.temp)
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
    }
  }
}
</script>

<style scoped>
.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
