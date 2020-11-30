<template>
  <el-table
    :data="tableData"
    style="width: 100%"
  >
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="管理员代码">
            <span>{{ props.row.id_admin }}</span>
          </el-form-item>
          <el-form-item label="管理员口令">
            <span>{{ props.row.password_admin }}</span>
          </el-form-item>
          <el-form-item label="内部结算价格">
            <span>{{ props.row.inner_price }}</span>
          </el-form-item>
          <el-form-item label="上行站点">
            <span>{{ props.row.up_distributions }}</span>
          </el-form-item>
          <el-form-item label="下行站点">
            <span>{{ props.row.down_distributions }}</span>
          </el-form-item>
          <el-form-item label="是否为主站点">
            <span>{{ props.row.is_main_distribution }}</span>
          </el-form-item>
          <el-form-item label="相关主站点">
            <span>{{ props.row.concerned_main_distribution }}</span>
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
      prop="id_distribution"
    />
    <el-table-column
      label="配送点名称"
      prop="name_distribution"
    />
    <el-table-column
      label="所属公司"
      prop="name_company"
    />
    <el-table-column
      label="创建时间"
      prop="create_time"
    />
    <el-table-column
      label="更新时间"
      prop="update_time"
    />
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)"
        >编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
        >删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'DistributionPage',
  data() {
    return {
      tableData: [{
        id_distribution: '0001',
        name_distribution: '不知道叫啥名',
        name_company: '反正不是你的公司',
        create_time: '2020-11-11',
        update_time: '2020-11-15',
        id_admin: '1111',
        password_admin: '123456',
        inner_price: '20￥',
        up_distributions: '上面那个站点',
        down_distributions: '下面那个站点',
        is_main_distribution: '是',
        concerned_main_distribution: '重庆站——成都站',
        longitude: '东经105°',
        latitude: '北纬28°'
      }, {
        id_distribution: '0002',
        name_distribution: '不知道叫啥名',
        name_company: '反正不是你的公司',
        create_time: '2020-11-11',
        update_time: '2020-11-15',
        id_admin: '1111',
        password_admin: '123456',
        inner_price: '20￥',
        up_distributions: '上面那个站点',
        down_distributions: '下面那个站点',
        is_main_distribution: '是',
        concerned_main_distribution: '重庆站——成都站',
        longitude: '东经105°',
        latitude: '北纬28°'
      }, {
        id_distribution: '0003',
        name_distribution: '不知道叫啥名',
        name_company: '反正不是你的公司',
        create_time: '2020-11-11',
        update_time: '2020-11-15',
        id_admin: '1111',
        password_admin: '123456',
        inner_price: '20￥',
        up_distributions: '上面那个站点',
        down_distributions: '下面那个站点',
        is_main_distribution: '是',
        concerned_main_distribution: '重庆站——成都站',
        longitude: '东经105°',
        latitude: '北纬28°'
      }, {
        id_distribution: '0004',
        name_distribution: '不知道叫啥名',
        name_company: '反正不是你的公司',
        create_time: '2020-11-11',
        update_time: '2020-11-15',
        id_admin: '1111',
        password_admin: '123456',
        inner_price: '20￥',
        up_distributions: '上面那个站点',
        down_distributions: '下面那个站点',
        is_main_distribution: '是',
        concerned_main_distribution: '重庆站——成都站',
        longitude: '东经105°',
        latitude: '北纬28°'
      }]
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
</style>
