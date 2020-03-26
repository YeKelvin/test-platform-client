<template>
  <el-dialog title="编辑角色" width="50%" v-bind="$attrs" v-on="$listeners">
    <el-form
      ref="modifyForm"
      label-width="auto"
      style="width: 80%"
      :model="modifyForm"
      :rules="modifyFormRules"
      @close="$emit('update:visible', false)"
    >
      <el-form-item label="角色名称：" prop="roleName">
        <el-input v-model="modifyForm.roleName" clearable />
      </el-form-item>
      <el-form-item label="角色备注：" prop="description">
        <el-input v-model="modifyForm.description" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('modifyForm')">更新</el-button>
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
        roleNo: '',
        roleName: '',
        description: ''
      },
      modifyFormRules: {
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '角色备注不能为空', trigger: 'blur' }]
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
          this.$confirm('修改该角色信息，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            User.modifyRole(this.modifyForm).then(response => {
              if (response.success) {
                this.$message({ message: '更新角色成功', type: 'info', duration: 2 * 1000 })
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
