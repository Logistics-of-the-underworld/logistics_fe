<template>
  <el-form ref="userInf" :model="userInf" :rules="roles" label-width="85px" style="width: 30%;margin-top: 30px">
    <el-form-item label="用户名：">
      <el-input v-model="userInf.username" :disabled="true" />
    </el-form-item>
    <el-form-item label="性别：">
      <el-radio-group v-model="userInf.sex" style="margin-left: 10%">
        <el-radio label="男" />
        <el-radio label="女" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="出生日期">
      <el-col :span="11">
        <el-form-item>
          <el-date-picker v-model="userInf.birthdata" type="date" placeholder="选择日期" style="width: 219%;" />
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label="邮箱：" prop="email">
      <el-input v-model="userInf.email" />
    </el-form-item>
    <el-form-item label="电话：" prop="phone">
      <el-input v-model="userInf.phone" placeholder="请输入电话" />
    </el-form-item>
    <el-form-item label="个性签名：">
      <el-input
        v-model="userInf.sign"
        type="textarea"
        placeholder="请输入内容"
        maxlength="100"
        :autosize="{ minRows: 3, maxRows: 5}"
        show-word-limit
      />
      <span style="font-size: 3px;color: #a2a2a2">请输入0-100个字符</span>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="width: 200px" :loading="loading" @click="saveInf">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'CustomerPage',
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
      } else {
        if (!(/^1[3456789]\d{9}$/.test(this.userInf.phone))) {
          callback(new Error('电话格式错误'))
        }
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (value === '') {
      } else {
        if (!(/^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/.test(this.userInf.email))) {
          callback(new Error('邮箱格式错误'))
        }
      }
    }
    return {
      userInf: {
        username: '',
        sex: '',
        email: '',
        phone: '',
        birthdata: ' ',
        sign: ''
      },
      roles: {
        email: [{ validator: validateEmail, trigger: 'blur' }],
        phone: [{ validator: validatePhone, trigger: 'blur' }]
      },
      loading: false
    }
  },
  mounted: function() {
    // this.init()
  },
  methods: {
    init() {
      this.$store.dispatch('user/getInfo')
      this.userInf.username = this.$store.getters.username
      this.userInf.sex = this.$store.getters.sex
      this.userInf.email = this.$store.getters.email
      this.userInf.phone = this.$store.getters.phone
      this.userInf.birthdata = this.$store.getters.birthdata
      this.userInf.sign = this.$store.getters.sign
    },
    saveInf() {
      this.loading = true
      this.userInf.birthdata = this.formattingDate(this.userInf.birthdata)
      this.postRequest('/changInf', this.userInf).then(resp => {
        this.loading = false
        var data = resp.data
        if (data.code === 200) {
          this.$message({
            message: data.message,
            type: 'success'
          })
        } else {
          this.$message({
            message: data.message,
            type: 'error'
          })
        }
      }).catch(error => {
        this.loading = false
        this.$message({
          message: error,
          type: 'error'
        })
      })
    },
    formattingDate(date) {
      date = new Date(Date.parse(date))
      const y = date.getFullYear()
      const m = date.getMonth() + 1
      const d = date.getDate()
      return y + '-' + m + '-' + d
    }
  }
}
</script>

<style scoped>

</style>
