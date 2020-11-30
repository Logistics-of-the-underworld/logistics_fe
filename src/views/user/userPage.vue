<template>
  <el-table
    :data="tableData"
    border
    style="width: 100%"
  >
    <el-table-column
      prop="id"
      label="ID"
      width="80"
    />
    <el-table-column
      prop="username"
      label="用户名"
      width="180"
    />
    <el-table-column
      prop="password"
      label="密码"
    />
    <el-table-column
      prop="email"
      label="邮箱"
    />
    <el-table-column
      prop="phone"
      label="电话"
      width="180"
    />
    <el-table-column
      prop="petname"
      label="用户昵称"
    />
    <el-table-column
      prop="role"
      label="权限"
    />
    <el-table-column
      prop="create_time"
      label="创建时间"
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
  name: 'UserPage',
  data() {
    return {
      tableData: [{
        id: '01',
        username: 'siri',
        password: '123456',
        email: '222222@qq.com',
        phone: '12345678900',
        petname: 'xiaoli',
        role: '配送点管理员',
        create_time: '2016-05-04'
      }, {
        id: '02',
        username: 'siri',
        password: '123456',
        email: '222222@qq.com',
        phone: '12345678900',
        petname: 'xiaoli',
        role: '配送点管理员',
        create_time: '2016-05-04'
      }, {
        id: '03',
        username: 'siri',
        password: '123456',
        email: '222222@qq.com',
        phone: '12345678900',
        petname: 'xiaoli',
        role: '配送点管理员',
        create_time: '2016-05-04'
      }, {
        id: '04',
        username: 'siri',
        password: '123456',
        email: '222222@qq.com',
        phone: '12345678900',
        petname: 'xiaoli',
        role: '配送点管理员',
        create_time: '2016-05-04'
      }]
    }
  }
}
</script>

<style scoped>

</style>
