<template>
  <div>
    <div class="add-form">
      <el-form id="form-style" ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="入职者名" prop="username">
          <el-input v-model="ruleForm.username" />
        </el-form-item>
        <el-form-item label="通知邮箱" prop="email">
          <el-input v-model="ruleForm.email" />
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="ruleForm.password" type="password" />
        </el-form-item>
        <el-form-item label="录用单位">
          <el-input v-model="organization" />
        </el-form-item>
      </el-form>
      <el-button :loading="addLoadingFlag" round class="send-button" @click="addWorker('ruleForm')"><i class="el-icon-upload" />入职邀请</el-button>
    </div>
  </div>
</template>

<script>
import { validEmail, validName } from '@/utils/validate'
import { register } from '@/api/user'

export default {
  name: 'AddUserPage',

  data() {
    return {
      ruleForm: {
        username: '',
        email: '',
        password: ''
      },
      organization: '',
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { validator: validName, trigger: 'blur' }
        ],
        email: [
          { validator: validEmail, trigger: 'blur', required: true }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      addLoadingFlag: false
    }
  },
  created() {
    if (JSON.parse(this.$store.getters.roles)[0] === 'admin') {
      this.organization = undefined
    } else {
      this.organization = this.$store.getters.organizationName
    }
    console.log(this.organization)
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    addWorker(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addLoadingFlag = true
          register({ 'user': JSON.stringify(this.ruleForm), 'organization': this.organization }).then(resp =>{
            this.$message.success(resp.message)
            this.addLoadingFlag = false
          })
        } else {
          this.$message.warning('请核对填写信息')
        }
      })
    }
  }
}
</script>

<style scoped>
  .add-form {
    width: 40%;
    margin: 0 auto;
  }
  .send-button {
    width: 100%;
  }
  #form-style {
    margin-left: -100px;
  }
</style>
