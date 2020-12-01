<template>
  <el-dialog title="编辑工作空间" width="50%" center v-bind="$attrs" v-on="$listeners">
    <el-form
      ref="modifyForm"
      label-width="auto"
      style="width: 80%"
      :model="modifyForm"
      :rules="modifyFormRules"
      @close="$emit('update:visible', false)"
    >
      <el-form-item label="空间名称：" prop="workspaceName">
        <el-input v-model="modifyForm.workspaceName" clearable />
      </el-form-item>
      <el-form-item label="空间描述：" prop="workspaceDesc">
        <el-input v-model="modifyForm.workspaceDesc" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submitForm('modifyForm')">更新</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import * as Workspace from '@/api/script/workspace'

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
        workspaceNo: '',
        workspaceName: '',
        workspaceType: 'TEST',
        workspaceDesc: ''
      },
      modifyFormRules: {
        workspaceName: [{ required: true, message: '工作空间名称不能为空', trigger: 'blur' }]
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
          this.$confirm('修改该工作空间信息，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            Workspace.modifyWorkspace(this.modifyForm).then(response => {
              if (response.success) {
                this.$message({ message: '更新工作空间成功', type: 'info', duration: 2 * 1000 })
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
