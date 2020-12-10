<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.idPackage" placeholder="封装袋号" style="width: 175px;margin-right:5px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        生成交接单
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      border
      @cell-dblclick="EditTableColumn"
      style="width: 100%"
    >
      <el-table-column
        prop="idHandoverOrder"
        label="交接单号"
      />
      <el-table-column
        prop="idPackage"
        label="封装货号"
      />
      <el-table-column
        prop="statSpot"
        label="发货地"
      />
      <el-table-column
        prop="handoverSpot"
        label="交接地"
        width="280px"
      >
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.handoverSpot" class="edit-input" size="small" />
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
          <span v-else>{{ row.handoverSpot }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="receiverName"
        label="接收人签字"
        width="200px"
      >
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.receiverName" class="edit-input" size="small" />
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
          <span v-else>{{ row.receiverName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
      />
      <el-table-column
        prop="updateTime"
        label="更新时间"
      />
      <el-table-column label="操作" width="170px">
        <template slot-scope="{row, $index}">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="handleUpdate(row)"
          >
            完成
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="confirmEdit(row)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(row,$index)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="creatOrderVisible" title="新建交接单" width="700px">
      <el-form ref="orderForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin:50px auto;">
        <el-form-item label="交接单号" prop="idHandoverOrder">
          <el-input v-model="temp.idHandoverOrder" />
        </el-form-item>
        <el-form-item label="封装袋号" prop="idPackage">
          <el-input v-model.number="temp.idPackage" />
        </el-form-item>
        <el-form-item label="订单编号" prop="idOrder">
          <el-input v-model.number="temp.idOrder" />
        </el-form-item>
        <el-form-item label="发货地" prop="statSpot">
          <el-input v-model="temp.statSpot" />
        </el-form-item>
        <el-form-item label="交接地" prop="handoverSpot">
          <el-input v-model="temp.handoverSpot" />
        </el-form-item>
        <el-form-item label="接收人签字" prop="receiverName">
          <el-input v-model="temp.receiverName" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="creatOrderVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData()">立即生成</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { fetchList, getHandoverByID, updateHandover,deteleHandover, addHandover } from '../../api/handoverslip'
import { mapGetters } from 'vuex'
import { deleteDistribution } from '../../api/distribution'

export default {
  name: 'HandoverPage',
  directives: { waves },
  data() {
    return {
      // 查询条件
      listQuery: {
        page: 1,
        limit: 20,
        idPackage: undefined
      },
      listLoading: false,
      tableData: undefined,
      creatOrderVisible: false,
      temp: {
        idOrder: undefined,
        idHandoverOrder: undefined,
        idPackage: undefined,
        statSpot: undefined,
        handoverSpot: undefined,
        receiverName: undefined
      },
      tempEdit: {},
      downloadLoading: false,
      rules: {
        idHandoverOrder: [{ required: true, message: '交接单号必填', trigger: 'change' }],
        idPackage: [{ required: true, message: '封装袋号必填', trigger: 'blur' }],
        statSpot: [{ required: true, message: '发货地必填', trigger: 'blur' }],
        idOrder: [{ required: true, message: '订单号必填', trigger: 'blur' }],
        handoverSpot: [{ required: true, message: '接受地必填', trigger: 'blur' }],
        receiverName: [{ required: true, message: '接收人签字', trigger: 'blur' }]
      },
    }
  },
  created() {
    this.getList()
  },
  computed: {
    ...mapGetters({
      roles: 'roles',
      organizationName: 'organizationName'
    })
  },
  methods: {
    async getList() {
      this.listLoading = true
      let parmas = this.organizationName
      await fetchList(parmas || 'no').then(res => {
        this.tableData = res.data
        this.tableData = this.tableData.map(v => {
          v.createTime = this.dayjs(v.createTime).format('YYYY-MM-DD')
          v.updateTime = this.dayjs(v.updateTime).format('YYYY-MM-DD')
          this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
          return v
        })
      })
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.page = 1
      console.log(this.listQuery.idPackage)
      let parmas = this.organizationName
      getHandoverByID(this.listQuery.idPackage, parmas).then(res => {
        this.tableData.length = 0
        this.tableData = res.data
        this.tableData = this.tableData.map(v => {
          v.createTime = this.dayjs(v.createTime).format('YYYY-MM-DD')
          v.updateTime = this.dayjs(v.updateTime).format('YYYY-MM-DD')
          this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
          return v
        })
      })
    },
    EditTableColumn(row, column, cell, event) {
      this.tempEdit.handoverSpot = row.handoverSpot
      this.tempEdit.receiverName = row.receiverName
      row.edit = !row.edit
    },
    cancelEdit(row) {
      row.handoverSpot = this.tempEdit.handoverSpot
      row.receiverName = this.tempEdit.receiverName
      row.edit = false
    },
    confirmEdit(row) {
      row.edit = true
    },
    restTemp() {
      this.temp = {
        idOrder: undefined,
        idHandoverOrder: undefined,
        idPackage: undefined,
        statSpot: undefined,
        handoverSpot: undefined,
        receiverName: undefined
      }
    },
    handleCreate() {
      if (this.username === '') {
        this.$router.replace('/login')
      }
      this.restTemp()
      this.creatOrderVisible = true
      this.$nextTick(() => {
        this.$refs['orderForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['orderForm'].validate((valid) => {
        if (valid) {
          addHandover({ addHandover: this.temp }).then(() => {
            this.creatOrderVisible = false
            this.getList()
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
      row.edit = false
      console.log(row)
      updateHandover({ handover: row }).then(res => {
        this.$notify({
          title: 'Success',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
        row.edit = false
      })
    },
    handleDelete(row, index) {
      console.log(row, index)
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
      return deteleHandover(row.idHandoverOrder)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['交接单号', '封装袋号', '交接地', '接收人签字', '创建时间', '更新时间']
        const filterVal = ['idHandoverOrder', 'idPackage', 'statSpot', 'receiverName', 'createTime', 'updateTime']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.organizationName + '- 交接单表'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.tableData.map(v => filterVal.map(j => {
        if (j === 'createTime') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
