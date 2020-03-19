<template>
  <el-dialog title="新增测试主题" width="50%" v-bind="$attrs" v-on="$listeners">
    <el-form
      ref="createForm"
      label-width="100px"
      style="width: 80%"
      :model="createForm"
      :rules="createFormRules"
      @close="$emit('update:visible', false)"
    >
      <el-form-item label="主题名称：" prop="topicName">
        <el-input v-model="createForm.topicName" clearable />
      </el-form-item>
      <el-form-item label="主题描述：" prop="topicDescription">
        <el-input v-model="createForm.topicDescription" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('createForm')">新增</el-button>
        <el-button @click="resetForm('createForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import * as Topic from '@/api/script/topic'

export default {
  name: 'CreateForm',
  data() {
    return {
      createForm: {
        topicName: '',
        topicDescription: ''
      },
      createFormRules: {
        topicName: [{ required: true, message: '主题名称不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          Topic.createTopic(this.createForm).then(response => {
            if (response.success) {
              this.$message({ message: '新增主题成功', type: 'info', duration: 2 * 1000 })
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
