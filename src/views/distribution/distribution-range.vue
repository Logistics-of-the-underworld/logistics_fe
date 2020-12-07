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
            <el-form-item label="开始配送时间">
              <span>{{ props.row.startDeliveryTime }}</span>
            </el-form-item>
            <el-form-item label="结束配送时间">
              <span>{{ props.row.endDeliveryTime }}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span>{{ props.row.marks }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="配送范围编码"
        prop="idRange"
      />
      <el-table-column
        label="配送点编码"
        prop="idDistribution"
      />
      <el-table-column
        label="范围名称"
        prop="nameRange"
      >
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.nameRange" class="edit-input" size="small" />
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
          <span v-else>{{ row.nameRange }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
      />
      <el-table-column
        label="更新时间"
        prop="updateTime"
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
        <el-form-item label="配送范围编码" prop="idRange">
          <el-input v-model="temp.idRange" :disabled="'update' === dialogStatus" />
        </el-form-item>
        <el-form-item label="开始配送时间" prop="startDeliveryTime">
          <el-input v-model="temp.startDeliveryTime" />
        </el-form-item>
        <el-form-item label="结束配送时间" prop="endDeliveryTime">
          <el-input v-model="temp.endDeliveryTime" />
        </el-form-item>
        <el-form-item label="备注" prop="marks">
          <el-input v-model="temp.marks" />
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
import { fetchList, deleteDistributionRange, updateDistributionRange } from '../../api/distributionRange'
import { mapGetters } from 'vuex'

export default {
  name: 'DistributionRange',
  data() {
    return {
      loading: true,
      tableData: [],
      tempEdit: {},
      temp: {
        idDistribution: undefined,
        idRange: undefined,
        startDeliveryTime: undefined,
        endDeliveryTime: undefined,
        marks: undefined
      },
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: '配送站点详情',
        create: '新建配送站点'
      },
      rules: {
        startDeliveryTime: [{ required: true, message: 'startDeliveryTime is required', trigger: 'blur' }],
        endDeliveryTime: [{ required: true, message: 'endDeliveryTime is required', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters({
      roles: 'roles'
    })
  },
  created() {
    this.getDistributionRange()
  },
  methods: {
    EditTableColumn(row, column, cell, event) {
      this.tempEdit.nameRange = row.nameRange
      row.edit = !row.edit
    },
    cancelEdit(row) {
      row.nameRange = this.tempEdit.nameRange
      row.edit = false
    },
    confirmEdit(row) {
      row.edit = false
      updateDistributionRange({ distributionRange: row }).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      })
    },
    async getDistributionRange() {
      this.loading = true
      let parmas = undefined
      if (this.roles[0] === 'admin' && this.roles[1] === 'distribution') {
        parmas = this.name_company
      }
      await fetchList(parmas || 'no').then(res => {
        this.tableData = res.data
        this.tableData = this.tableData.map(v => {
          v.createTime = this.dayjs(v.createTime).format('YYYY-MM-DD')
          v.updateTime = this.dayjs(v.updateTime).format('YYYY-MM-DD')
          v.startDeliveryTime = this.dayjs(v.startDeliveryTime).format('YYYY-MM-DD HH:mm')
          v.endDeliveryTime = this.dayjs(v.endDeliveryTime).format('YYYY-MM-DD HH:mm')
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
      return deleteDistributionRange(row.idRange)
    },
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.temp = Object.assign({}, row) // copy obj
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      console.log(row)
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateDistributionRange({ distributionRange: tempData }).then(() => {
            const index = this.tableData.findIndex(v => v.idRange === this.temp.idRange)
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
