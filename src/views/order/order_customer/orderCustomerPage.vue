<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.idOrder" placeholder="订单号" style="width: 200px;margin-right:12px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.receiverAddress" placeholder="收寄地" style="width: 200px;margin-right:12px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="用户评价" clearable style="width: 120px;margin-right:12px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.stateOrder" placeholder="订单状态" clearable class="filter-item" style="width: 130px;margin-right:12px">
        <el-option v-for="item in orderStateOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        创建订单
      </el-button>
      <el-button v-if="this.username !== ''" v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;margin-right:12px" @change="tableKey=tableKey+1">
        隐藏
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
        style="width: 100%"
        @sort-change="sortChange"
      >
        <el-table-column label="订单编号" prop="idOrder" sortable="custom" align="center" :class-name="getSortClass('id')">
          <template slot-scope="{row}">
            <span>{{ row.idOrder }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="寄件人姓名" align="center">
          <template slot-scope="{row}">
            <span>{{ row.senderName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收件人姓名" align="center">
          <template slot-scope="{row}">
            <span>{{ row.receiverName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="配送价格" align="center">
          <template slot-scope="{row}">
            <span>{{ row.deliveryPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="评价">
          <template slot-scope="{row}">
            <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
          </template>
        </el-table-column>
        <el-table-column label="订单状态" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.stateOrder | statusFilter">
              {{ orderStateTypeKeyValue[row.stateOrder] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="showReviewer" label="Reviewer" align="center">
          <template slot-scope="{row}">
            <span style="color:red;">{{ row.reviewer }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
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

    <el-dialog title="更新订单信息" :visible.sync="dialogFormVisible" width="800px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="180px" style="width: 400px; margin-left:50px;">
        <el-form-item label="订单编号" prop="idOrder">
          <el-input v-model="temp.idOrder" :disabled="'update' === dialogStatus" />
        </el-form-item>
        <el-form-item label="配送时间" prop="deliveryTime">
          <el-input v-model="temp.deliveryTime" :disabled="'update' === dialogStatus" />
        </el-form-item>
        <el-form-item v-if="1 <= temp.stateOrder" label="条形码" prop="barCodeUrl">
          <el-image :src="temp.barCodeUrl">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </el-form-item>
        <el-form-item label="配送车辆" prop="idLicense">
          <el-input v-model="temp.idLicense" :disabled="'update' === dialogStatus" />
        </el-form-item>
        <el-form-item label="寄件人姓名" prop="senderName">
          <el-input v-model="temp.senderName" :disabled="'未处理' !== orderStateTypeKeyValue[temp.stateOrder]" />
        </el-form-item>
        <el-form-item label="寄件人电话" prop="senderPhone">
          <el-input v-model="temp.senderPhone" :disabled="'未处理' !== orderStateTypeKeyValue[temp.stateOrder]" />
        </el-form-item>
        <el-form-item label="收件人姓名" prop="receiverName">
          <el-input v-model="temp.receiverName" :disabled="'未处理' !== orderStateTypeKeyValue[temp.stateOrder]" />
        </el-form-item>
        <el-form-item label="收件人电话" prop="receiverPhone">
          <el-input v-model="temp.receiverPhone" :disabled="'未处理' !== orderStateTypeKeyValue[temp.stateOrder]" />
        </el-form-item>
        <el-form-item label="订单状态" prop="stateOrder">
          <el-select v-model="temp.stateOrder" class="filter-item" placeholder="Please select" :disabled="'update' === dialogStatus">
            <el-option v-for="item in orderStateOptions" :key="item.display_name" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式" prop="paymentMethod">
          <el-input v-model="temp.paymentMethod" :disabled="'update' === dialogStatus" />
        </el-form-item>
        <el-form-item label="配送人" prop="courier">
          <el-input v-model="temp.courier" :disabled="'update' === dialogStatus" />
        </el-form-item>
        <el-form-item label="配送人电话" prop="courierPhone">
          <el-input v-model="temp.courierPhone" :disabled="'update' === dialogStatus" />
        </el-form-item>
        <el-form-item v-if="6 === temp.stateOrder" label="用户评价">
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
        <el-button type="primary" @click="updateData()">
          保存
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="creatOrderVisible" title="新建订单" width="800px">
      <el-form ref="orderForm" :rules="rules" :model="newOrderData" label-position="left" label-width="120px" style="width: 400px; margin:50px auto;">
        <el-form-item label="寄件人姓名" prop="senderName">
          <el-input v-model="newOrderData.senderName" />
        </el-form-item>
        <el-form-item label="寄件人电话" prop="senderPhone">
          <el-input v-model.number="newOrderData.senderPhone" />
        </el-form-item>
        <el-form-item label="寄件人地址" prop="senderAddress">
          <el-input v-model="newOrderData.senderAddress" />
        </el-form-item>
        <el-form-item label="收件人姓名" prop="receiverName">
          <el-input v-model="newOrderData.receiverName" />
        </el-form-item>
        <el-form-item label="收件人电话" prop="receiverPhone">
          <el-input v-model.number="newOrderData.receiverPhone" />
        </el-form-item>
        <el-form-item label="收件人地址" prop="receiverAddress">
          <el-input v-model="newOrderData.receiverAddress" />
        </el-form-item>
        <el-form-item label="物品名称" prop="nameGoods">
          <el-input v-model="newOrderData.nameGoods" />
        </el-form-item>
        <el-form-item label="物品数量" prop="countGoods">
          <el-input v-model.number="newOrderData.countGoods" />
        </el-form-item>
        <el-form-item label="物品类别" prop="idSortGoods">
          <el-select v-model="newOrderData.idSortGoods" class="filter-item" placeholder="请选择">
            <el-option v-for="item in goodsSortStateOption" :key="item.display_name" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="newOrderData.deliveryPrice" label="配送价格" prop="deliveryPrice">
          <el-input v-model="newOrderData.deliveryPrice" disabled />
        </el-form-item>
        <el-form-item label="支付方式" prop="paymentMethod">
          <el-select v-model="newOrderData.paymentMethod" class="filter-item" placeholder="请选择">
            <el-option v-for="item in paymentMethodStateOptions" :key="item.display_name" :label="item.display_name" :value="item.display_name" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="marks">
          <el-input v-model="newOrderData.marks" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="creatOrderVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData()">立即下单</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPv } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { fetchList, createOrder, updateOrder, getOne } from '@/api/orderCustomer'
import { mapGetters } from 'vuex'
const paymentMethodStateOptions = [
  { key: 0, display_name: '在线支付' },
  { key: 1, display_name: '货到付款' }
]
const goodsSortStateOption = [
  { key: 100, display_name: '食物' },
  { key: 101, display_name: '衣物' },
  { key: 102, display_name: '办公用品' },
  { key: 103, display_name: '体育用品' }
]
const orderStateOptions = [
  { key: 0, display_name: '未处理' },
  { key: 1, display_name: '审核通过' },
  { key: 2, display_name: '在途中' },
  { key: 3, display_name: '在配送中' },
  { key: 4, display_name: '已签收' },
  { key: 5, display_name: '等待支付' },
  { key: 6, display_name: '已完成' },
  { key: 7, display_name: '退订' }
]
const orderStateTypeKeyValue = orderStateOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  name: 'OrderView',
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
      list: undefined,
      total: 0,
      listLoading: false,
      orderStateOptions,
      paymentMethodStateOptions,
      orderStateTypeKeyValue,
      goodsSortStateOption,
      listQuery: {
        page: 1,
        limit: 20,
        idOrder: undefined,
        importance: undefined,
        receiverAddress: undefined,
        stateOrder: undefined
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      temp: {
        idOrder: undefined,
        barCodeUrl: undefined,
        importance: 0,
        senderName: '',
        senderPhone: undefined,
        receiverName: '',
        receiverPhone: undefined,
        deliveryTime: undefined,
        idLicense: undefined,
        stateOrder: 0,
        courier: '',
        courierPhone: undefined,
        marks: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '更新订单信息',
        create: '创建订单信息'
      },
      creatOrderVisible: false,
      newOrderData: {
        idOrder: undefined,
        idGoods: undefined,
        senderName: '',
        senderPhone: undefined,
        senderAddress: undefined,
        receiverName: '',
        receiverPhone: undefined,
        receiverAddress: undefined,
        paymentMethod: undefined,
        createTime: undefined,
        nameGoods: undefined,
        countGoods: undefined,
        idSortGoods: undefined,
        deliveryPrice: undefined,
        itemSort: undefined,
        username: this.username,
        marks: ''
      },
      rules: {
        idLicense: [{ required: true, message: '车牌是必须的', trigger: 'change' }],
        senderName: [{ required: true, message: '寄件人姓名必填', trigger: 'blur' }],
        senderPhone: [{ required: true, message: '寄件人电话必填', trigger: 'blur' }, { type: 'number', message: '电话号码11位且是纯数字', trigger: 'blur' }],
        receiverName: [{ required: true, message: '收件人姓名必填', trigger: 'blur' }],
        receiverPhone: [{ required: true, message: '收件人电话必填', trigger: 'blur' }, { type: 'number', message: '电话号码11位且是纯数字', trigger: 'blur' }],
        receiverAddress: [{ required: true, message: '收件人地址必填', trigger: 'blur' }],
        countGoods: [{ type: 'number', required: false, message: '只能为数字', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'username'
    ])
  },
  created() {
    if (this.username !== '') {
      this.getList()
    }
  },
  methods: {
    async getList() {
      this.listLoading = true
      await fetchList(this.listQuery).then(res => {
        this.total = res.total
        this.list = res.data
        this.list = this.list.map(v => {
          v.createTime = this.dayjs(v.createTime).format('YYYY-MM-DD HH:mm')
          return v
        })
        this.listLoading = false
      })
    },
    handleFilter() {
      if (this.username !== '') {
        if (this.listQuery.idOrder) {
          this.getOne()
        } else {
          this.listQuery.page = 1
          this.getList()
        }
      }
    },
    async getOne() {
      this.listLoading = true
      await getOne(this.listQuery.idOrder).then(res => {
        this.list = []
        this.list.push(res.data)
        this.list = this.list.map(v => {
          v.createTime = this.dayjs(v.createTime).format('YYYY-MM-DD HH:mm')
          return v
        })
      })
      this.listLoading = false
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
    restOderTemp() {
      this.newOrderData = {
        idOrder: undefined,
        idGoods: undefined,
        senderName: '',
        senderPhone: undefined,
        senderAddress: undefined,
        receiverName: '',
        receiverPhone: undefined,
        receiverAddress: undefined,
        paymentMethod: undefined,
        createTime: undefined,
        nameGoods: undefined,
        countGoods: undefined,
        idSortGoods: undefined,
        deliveryPrice: undefined,
        itemSort: undefined,
        username: this.username,
        marks: ''
      }
    },
    handleCreate() {
      if (this.username === '') {
        this.$router.replace('/login')
      }
      this.restOderTemp()
      this.creatOrderVisible = true
      this.$nextTick(() => {
        this.$refs['orderForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['orderForm'].validate((valid) => {
        if (valid) {
          this.newOrderData.idOrder = 'BZX' + parseInt(Math.random() * 1000) + 1024 // mock a id
          this.newOrderData.idGoods = 'ZXC' + parseInt(Math.random() * 1000) + 1024 // mock a id
          this.newOrderData.deliveryPrice = 20.00
          createOrder({ order: this.newOrderData }).then(() => {
            const temp = Object.assign(this.temp, this.newOrderData)
            temp.createTime = new Date()
            this.list.unshift(temp)
            this.creatOrderVisible = false
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
          updateOrder({ order: tempData }).then(() => {
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
      row.stateOrder = 7
      this.deleteData(row).then(res => {
        if (res.code === 20000) {
          this.$notify({
            title: 'Success',
            message: '退订成功',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        }
      })
    },
    deleteData(row) {
      return updateOrder({ order: row })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.newOrderData = response.data.newOrderData
        this.creatOrderVisible = true
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
