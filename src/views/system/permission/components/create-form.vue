<template>
  <el-dialog title="新增权限" width="50%" center v-bind="$attrs" v-on="$listeners">
    <el-form
      ref="createForm"
      label-width="auto"
      style="width: 80%"
      :model="createForm"
      :rules="createFormRules"
      @close="$emit('update:visible', false)"
    >
      <el-form-item label="权限名称：" prop="permissionName">
        <el-input v-model="createForm.permissionName" clearable />
      </el-form-item>
      <el-form-item label="权限描述：" prop="permissionDesc">
        <el-input v-model="createForm.permissionDesc" clearable />
      </el-form-item>
      <el-form-item label="请求路由：" prop="endpoint">
        <el-input v-model="createForm.endpoint" clearable />
      </el-form-item>
      <el-form-item label="请求方法：" prop="method">
        <el-select v-model="createForm.method" clearable style="width: 100%;">
          <el-option
            v-for="(value, key) in HttpMethods"
            :key="key"
            :label="value"
            :value="value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submitForm('createForm')">新增</el-button>
        <el-button size="small" @click="resetForm('createForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { HttpMethods } from '@/api/enum'
import * as User from '@/api/user'

export default {
  name: 'CreateForm',
  data() {
    return {
      HttpMethods: HttpMethods,
      createForm: {
        permissionName: '',
        permissionDesc: '',
        endpoint: '',
        method: ''
      },
      createFormRules: {
        permissionName: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        endpoint: [{ required: true, message: '请求路由不能为空', trigger: 'blur' }],
        method: [{ required: true, message: '请求方法不能为空', trigger: 'change' }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          User.createPermission(this.createForm).then(response => {
            if (response.success) {
              this.$message({ message: '新增权限成功', type: 'info', duration: 2 * 1000 })
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
