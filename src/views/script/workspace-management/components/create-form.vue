<template>
  <el-dialog title="新增工作空间" width="50%" v-bind="$attrs" v-on="$listeners">
    <el-form
      ref="createForm"
      label-width="auto"
      style="width: 80%"
      :model="createForm"
      :rules="createFormRules"
      @close="$emit('update:visible', false)"
    >
      <el-form-item label="工作空间名称：" prop="workspaceName">
        <el-input v-model="createForm.workspaceName" clearable />
      </el-form-item>
      <el-form-item label="工作空间类型：" prop="workspaceType">
        <el-input v-model="createForm.workspaceType" clearable />
      </el-form-item>
      <el-form-item label="工作空间描述：" prop="workspaceDesc">
        <el-input v-model="createForm.workspaceDesc" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('createForm')">新增</el-button>
        <el-button @click="resetForm('createForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import * as Workspace from '@/api/script/workspace'

export default {
  name: 'CreateForm',
  data() {
    return {
      createForm: {
        workspaceName: '',
        workspaceType: '',
        workspaceDesc: ''
      },
      createFormRules: {
        workspaceName: [{ required: true, message: '工作空间名称不能为空', trigger: 'blur' }],
        workspaceType: [{ required: true, message: '工作空间类型不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          Workspace.createWorkspace(this.createForm).then(response => {
            if (response.success) {
              this.$message({ message: '新增工作空间成功', type: 'info', duration: 2 * 1000 })
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
