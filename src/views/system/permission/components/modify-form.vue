<template>
  <el-dialog title="编辑权限" width="50%" center v-bind="$attrs" v-on="$listeners">
    <el-form
      ref="modifyForm"
      label-width="auto"
      style="width: 80%"
      :model="modifyForm"
      :rules="modifyFormRules"
      @close="$emit('update:visible', false)"
    >
      <el-form-item label="权限名称：" prop="permissionName">
        <el-input v-model="modifyForm.permissionName" clearable />
      </el-form-item>
      <el-form-item label="权限描述：" prop="permissionDesc">
        <el-input v-model="modifyForm.permissionDesc" clearable />
      </el-form-item>
      <el-form-item label="请求路由：" prop="endpoint">
        <el-input v-model="modifyForm.endpoint" clearable />
      </el-form-item>
      <el-form-item label="请求方法：" prop="method">
        <el-select v-model="modifyForm.method" clearable style="width: 100%;">
          <el-option
            v-for="(value, key) in HttpMethods"
            :key="key"
            :label="value"
            :value="value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submitForm('modifyForm')">更新</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import * as User from '@/api/user'
import { HttpMethods } from '@/api/enum'

export default {
  name: 'ModifyForm',
  props: {
    currentRow: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      HttpMethods: HttpMethods,
      modifyForm: {
        permissionNo: '',
        permissionName: '',
        permissionDesc: '',
        endpoint: '',
        method: ''
      },
      modifyFormRules: {
        permissionName: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        endpoint: [{ required: true, message: '请求路由不能为空', trigger: 'blur' }],
        method: [{ required: true, message: '请求方法不能为空', trigger: 'change' }]
      }
    }
  },
  watch: {
    currentRow: function() {
      this.modifyForm = { ...this.currentRow }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm(
            '确认修改？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
          ).then(() => {
            User.modifyPermission(this.modifyForm).then(response => {
              if (response.success) {
                this.$message({ message: '更新权限成功', type: 'info', duration: 2 * 1000 })
                // 关闭dialog
                this.$emit('update:visible', false)
                // 重新查询列表
                this.$emit('re-query')
              }
            }).catch(() => {})
          }).catch(() => {})
        } else {
          this.$message({ message: '数据校验不通过', type: 'error', duration: 2 * 1000 })
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
