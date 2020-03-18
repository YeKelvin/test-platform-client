<template>
  <el-dialog title="新增角色" width="50%" v-bind="$attrs" v-on="$listeners">
    <el-form
      ref="createForm"
      label-width="100px"
      style="width: 80%"
      :model="createForm"
      :rules="createFormRules"
      @close="$emit('update:visible', false)"
    >
      <el-form-item label="角色名称：" prop="roleName">
        <el-input v-model="createForm.roleName" clearable />
      </el-form-item>
      <el-form-item label="角色备注：" prop="description">
        <el-input v-model="createForm.description" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('createForm')">新增</el-button>
        <el-button @click="resetForm('createForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import * as User from '@/api/user'

export default {
  name: 'CreateForm',
  data() {
    return {
      createForm: {
        roleName: '',
        description: ''
      },
      createFormRules: {
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '角色备注不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          User.createRole(this.createForm).then(response => {
            if (response.success) {
              this.$message({ message: '新增角色成功', type: 'info', duration: 2 * 1000 })
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
