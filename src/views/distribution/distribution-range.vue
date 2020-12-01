<template>
  <el-table
    :data="tableData"
    style="width: 100%"
  >
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="开始配送时间">
            <span>{{ props.row.start_delivery_time }}</span>
          </el-form-item>
          <el-form-item label="结束配送时间">
            <span>{{ props.row.end_delivery_time }}</span>
          </el-form-item>
          <el-form-item label="备注">
            <span>{{ props.row.marks }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      label="配送范围编码"
      prop="id_range"
    />
    <el-table-column
      label="配送点编码"
      prop="id_distribution"
    />
    <el-table-column
      label="范围名称"
      prop="name_range"
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
  name: 'DistributionRange',
  data() {
    return {
      tableData: [{
        id_range: '0001',
        id_distribution: '0710',
        name_range: '从这到那、',
        create_time: '2020-11-11',
        update_time: '2020-11-15',
        start_delivery_time: '9:00 am',
        end_delivery_time: '10:00 pm',
        marks: '这个很贵的，要轻拿轻放'
      }, {
        id_range: '0001',
        id_distribution: '0710',
        name_range: '从这到那、',
        create_time: '2020-11-11',
        update_time: '2020-11-15',
        start_delivery_time: '9:00 am',
        end_delivery_time: '10:00 pm',
        marks: '这个很贵的，要轻拿轻放'
      }, {
        id_range: '0001',
        id_distribution: '0710',
        name_range: '从这到那、',
        create_time: '2020-11-11',
        update_time: '2020-11-15',
        start_delivery_time: '9:00 am',
        end_delivery_time: '10:00 pm',
        marks: '这个很贵的，要轻拿轻放'
      }, {
        id_range: '0001',
        id_distribution: '0710',
        name_range: '从这到那、',
        create_time: '2020-11-11',
        update_time: '2020-11-15',
        start_delivery_time: '9:00 am',
        end_delivery_time: '10:00 pm',
        marks: '这个很贵的，要轻拿轻放'
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
