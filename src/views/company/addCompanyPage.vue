<template>
  <div>
    <div class="add-form">
      <el-form id="form-style" ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="分公司名称" prop="nameCompany">
          <el-input v-model="ruleForm.nameCompany" />
        </el-form-item>
        <el-form-item label="负责人姓名" prop="username">
          <el-input v-model="ruleForm.username" />
        </el-form-item>
        <el-form-item label="负责人邮箱" prop="email">
          <el-input v-model="ruleForm.email"/>
        </el-form-item>
        <el-form-item label="初始密码" prop="password">
          <el-input v-model="ruleForm.password" type="password" />
        </el-form-item>
        <el-form-item label="所属公司">
          <el-input v-model="ruleForm.head_company" />
        </el-form-item>
      </el-form>
      <el-button :loading="addLoadingFlag" round class="send-button" @click="addWorker('ruleForm')"><i class="el-icon-upload" />添加新分公司</el-button>
    </div>
  </div>
</template>

<script>
import { validCompanyName, validEmail, validName } from '@/utils/validate'
import { register } from '@/api/user'
import { addCompany } from '@/api/company'

export default {
  name: 'AddCompanyPage',

  data() {
    return {
      ruleForm: {
        nameCompany: '',
        head_company: this.$store.getters.organizationName,
        username: '',
        email: '',
        password: ''
      },
      company: {
        nameCompany: '',
        head_company: this.$store.getters.organizationName
      },
      user: {
        username: '',
        email: '',
        password: ''
      },
      organization: '',
      rules: {
        nameCompany: [
          { required: true, message: '公司名不能为空', trigger: 'blur' },
          { validator: validCompanyName, trigger: 'blur' }
        ],
        organization: [
          { required: true, message: '所属组织不能为空', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '负责人姓名不能为空', trigger: 'blur' }
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
      this.formatData()
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addLoadingFlag = true
          addCompany({ 'userStr': JSON.stringify(this.user), 'company': JSON.stringify(this.company) }).then(resp => {
            this.$message.success(resp.message)
            this.addLoadingFlag = false
          })
        } else {
          this.$message.warning('请核对填写信息')
        }
      })
    },
    formatData() {
      this.company.nameCompany = this.ruleForm.nameCompany
      this.company.head_company = 1
      this.user.username = this.ruleForm.username
      this.user.email = this.ruleForm.email
      this.user.password = this.ruleForm.password
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
