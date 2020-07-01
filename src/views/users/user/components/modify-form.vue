<template>
  <el-dialog title="编辑用户" width="50%" v-bind="$attrs" v-on="$listeners">
    <el-form
      ref="userModifyForm"
      label-width="auto"
      style="width: 80%"
      :model="modifyForm"
      :rules="modifyFormRules"
      @close="$emit('update:visible', false)"
    >
      <el-form-item label="用户名称：" prop="userName">
        <el-input v-model="modifyForm.userName" clearable />
      </el-form-item>
      <el-form-item label="手机号：" prop="mobileNo">
        <el-input v-model="modifyForm.mobileNo" clearable />
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="modifyForm.email" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('userModifyForm')">更新</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import * as User from '@/api/user'

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
      modifyForm: {
        userNo: '',
        userName: '',
        password: '',
        mobileNo: '',
        email: ''
      },
      modifyFormRules: {
        userName: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
        mobileNo: [{ required: false }],
        email: [{ required: false }]
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
            User.modifyUser(this.modifyForm).then(response => {
              if (response.success) {
                this.$message({ message: '更新用户信息成功', type: 'info', duration: 2 * 1000 })
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
