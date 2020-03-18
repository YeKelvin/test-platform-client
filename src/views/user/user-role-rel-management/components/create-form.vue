<template>
  <el-dialog title="新增角色权限关联关系" width="50%" v-bind="$attrs" v-on="$listeners">
    <el-form
      ref="createForm"
      label-width="100px"
      style="width: 80%"
      :model="createForm"
      :rules="createFormRules"
      @close="$emit('update:visible', false)"
    >
      <el-form-item label="用户名称：" prop="userNo">
        <el-select v-model="createForm.userNo" filterable clearable placeholder="请输入关键词" style="width: 100%;">
          <el-option
            v-for="user in userList"
            :key="user.userNo"
            :label="user.username"
            :value="user.userNo"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="角色名称：" prop="roleNo">
        <el-select v-model="createForm.roleNo" filterable clearable placeholder="请输入关键词" style="width: 100%;">
          <el-option
            v-for="role in roleList"
            :key="role.roleNo"
            :label="role.roleName"
            :value="role.roleNo"
          />
        </el-select>
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
      userList: [],
      roleList: [],
      createForm: {
        userNo: '',
        roleNo: ''
      },
      createFormRules: {
        userNo: [{ required: true, message: '用户名称不能为空', trigger: 'blur' }],
        roleNo: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    User.queryUserAll().then(response => {
      if (response.success) {
        this.userList = response.result
      }
    }).catch(() => {})

    User.queryRoleAll().then(response => {
      if (response.success) {
        this.roleList = response.result
      }
    }).catch(() => {})
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          User.createUserRoleRel(this.createForm).then(response => {
            if (response.success) {
              this.$message({ message: '新增用户角色关联关系成功', type: 'info', duration: 2 * 1000 })
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
