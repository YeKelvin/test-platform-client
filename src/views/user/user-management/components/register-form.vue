<template>
  <el-dialog title="用户注册" width="50%" v-bind="$attrs" v-on="$listeners">
    <el-form
      ref="registerForm"
      label-width="auto"
      style="width: 80%"
      :model="registerForm"
      :rules="registerFormRules"
      @close="$emit('update:visible', false)"
    >
      <el-form-item label="用户名称：" prop="userName">
        <el-input v-model="registerForm.userName" clearable />
      </el-form-item>
      <el-form-item label="登录账号：" prop="loginName">
        <el-input v-model="registerForm.loginName" clearable />
      </el-form-item>
      <el-form-item label="登录密码：" prop="password">
        <el-input v-model="registerForm.password" clearable />
      </el-form-item>
      <el-form-item label="手机号：" prop="mobileNo">
        <el-input v-model="registerForm.mobileNo" clearable />
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="registerForm.email" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('registerForm')">注册</el-button>
        <el-button @click="resetForm('registerForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import * as User from '@/api/user'

export default {
  name: 'RegisterForm',
  data() {
    return {
      registerForm: {
        userName: '',
        loginName: '',
        password: '',
        mobileNo: '',
        email: ''
      },
      registerFormRules: {
        userName: [{ required: true, message: '用户名称不能为空', trigger: 'blur' }],
        loginName: [{ required: true, message: '登录账号不能为空', trigger: 'blur' }],
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
          User.register(this.registerForm).then(response => {
            if (response.success) {
              this.$message({ message: '注册成功', type: 'info', duration: 2 * 1000 })
              // 关闭dialog
              this.$emit('update:visible', false)
              // 重新查询列表
              this.$emit('re-query')
            }
          }).catch(() => {})
        } else {
          this.$message({ message: '数据校验不通过', type: 'error', duration: 2 * 1000 })
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

</style>
