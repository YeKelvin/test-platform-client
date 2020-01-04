<template>
  <div class="app-main-container register-container">
    <div>用户注册</div>
    <el-divider />
    <el-form ref="registerForm" :model="registerForm" :rules="rules" label-width="100px" style="width: 60%">
      <el-form-item label="用户名称：" prop="username">
        <el-input v-model="registerForm.username" />
      </el-form-item>
      <el-form-item label="用户昵称：" prop="nickname">
        <el-input v-model="registerForm.nickname" />
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input v-model="registerForm.password" />
      </el-form-item>
      <el-form-item label="手机号：" prop="mobileNo">
        <el-input v-model="registerForm.mobileNo" />
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="registerForm.email" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('registerForm')">注册</el-button>
        <el-button type="primary" @click="resetForm('registerForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as User from '@/api/user'
import { Message } from 'element-ui'
export default {
  name: 'Register',
  data() {
    return {
      registerForm: {
        username: '',
        nickname: '',
        password: '',
        mobileNo: '',
        email: ''
      },
      rules: {
        username: [{ required: true, message: '用户名称不能为空', trigger: 'blur' }],
        nickname: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        mobileNo: [{ required: false }],
        email: [{ required: false }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const vue = this
          User.register(this.registerForm).then(response => {
            const { success } = response
            if (success) {
              Message({
                message: '注册成功',
                type: 'info',
                duration: 2 * 1000
              })
              vue.$route.replace({ path: 'user-list' })
            }
          })
        } else {
          Message({
            message: '数据校验不通过',
            type: 'error',
            duration: 2 * 1000
          })
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .register-container {
    display: flex;
    flex-direction: column;
    align-content: flex-start;

    height: 100%;
    padding: 25px;
  }
</style>
