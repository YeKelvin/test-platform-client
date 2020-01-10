<template>
  <scrollbar class="app-main-container">
    <div class="user-manager-container">

      <div class="query-conditions-container">
        <div>查询条件</div>
        <el-divider />
        <div class="condition-items">
          <condition-input v-model="queryConditions.userNo" label="用户编号" class="condition-item" />
          <condition-input v-model="queryConditions.username" label="用户名称" class="condition-item" />
          <condition-input v-model="queryConditions.nickname" label="用户昵称" class="condition-item" />
          <condition-input v-model="queryConditions.mobileNo" label="手机号" class="condition-item" />
          <condition-input v-model="queryConditions.email" label="邮箱地址" class="condition-item" />
          <condition-select v-model="queryConditions.state" :options="UserState" label="用户状态" class="condition-item" />
        </div>
        <div class="query-buttons-container">
          <div />
          <div class="query-buttons">
            <el-button type="primary" @click="query">查询</el-button>
            <el-button @click="resetQueryConditions">重置</el-button>
          </div>
          <el-button type="primary" @click="registerDialogVisible=true">新增</el-button>
        </div>
      </div>

      <div class="table-container">
        <div>查询结果</div>
        <el-divider />
        <el-table
          :data="tableData"
          style="width: 100%"
          height="160"
          :border="true"
          :stripe="true"
          :fit="true"
          :highlight-current-row="true"
        >
          <el-table-column prop="userNo" label="用户编号" min-width="150" />
          <el-table-column prop="username" label="用户名称" min-width="150" />
          <el-table-column prop="nickname" label="用户昵称" min-width="150" />
          <el-table-column prop="mobileNo" label="手机号" min-width="150" />
          <el-table-column prop="email" label="邮箱" min-width="150" />
          <el-table-column prop="state" label="状态" min-width="150" />
          <el-table-column fixed="right" label="操作" min-width="150">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="openModifyDialogVisible(row)">编辑</el-button>
              <el-button type="text" size="small" @click="resetPassword(row)">重置密码</el-button>
              <el-button v-if="row.state==='NORMAL'" type="text" size="small" @click="modifyUserState(row,'DISABLE')">
                禁用
              </el-button>
              <el-button v-else type="text" size="small" @click="modifyUserState(row,'NORMAL')">启用</el-button>
              <el-button type="text" size="small" @click="disableUser(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination-container">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :current-page="currentPage"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="pageSize"
          :total="totalSize"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange"
        />
      </div>
    </div>

    <el-dialog title="用户注册" width="50%" :visible.sync="registerDialogVisible">
      <el-form
        ref="registerForm"
        label-width="100px"
        style="width: 80%"
        :model="registerForm"
        :rules="registerFormRules"
      >
        <el-form-item label="用户名称：" prop="username">
          <el-input v-model="registerForm.username" />
        </el-form-item>
        <el-form-item label="用户昵称：" prop="nickname">
          <el-input v-model="registerForm.nickname" />
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="registerForm.password" />
        </el-form-item>
        <el-form-item label="手机号：" prop="mobileNo">
          <el-input v-model="registerForm.mobileNo" />
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="registerForm.email" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitRegisterForm('registerForm')">注册</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="编辑用户" width="50%" :visible.sync="modifyDialogVisible">
      <el-form
        ref="userModifyForm"
        label-width="100px"
        style="width: 80%"
        :model="userModifyForm"
        :rules="userModifyFormRules"
      >
        <el-form-item label="用户名称：" prop="username">
          <el-input v-model="userModifyForm.username" />
        </el-form-item>
        <el-form-item label="用户昵称：" prop="nickname">
          <el-input v-model="userModifyForm.nickname" />
        </el-form-item>
        <el-form-item label="手机号：" prop="mobileNo">
          <el-input v-model="userModifyForm.mobileNo" />
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="userModifyForm.email" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitModifyForm('userModifyForm')">更新</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </scrollbar>
</template>

<script>
import * as User from '@/api/user'
import { UserState } from '@/api/enum'
import ConditionInput from '@/components/QueryCondition/condition-input'
import ConditionSelect from '@/components/QueryCondition/condition-select'

export default {
  name: 'UserList',
  components: { ConditionInput, ConditionSelect },
  data() {
    return {
      // 查询条件
      UserState: UserState,
      queryConditions: {
        userNo: '',
        username: '',
        nickname: '',
        mobileNo: '',
        email: '',
        state: ''
      },
      // 表格数据
      tableData: [],
      // 分页信息
      currentPage: 1,
      pageSize: 10,
      totalSize: 0,
      // 用户注册 dialog相关属性
      registerDialogVisible: false,
      registerForm: {
        username: '',
        nickname: '',
        password: '',
        mobileNo: '',
        email: ''
      },
      registerFormRules: {
        username: [{ required: true, message: '用户名称不能为空', trigger: 'blur' }],
        nickname: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        mobileNo: [{ required: false }],
        email: [{ required: false }]
      },
      // 用户编辑 dialog相关属性
      modifyDialogVisible: false,
      userModifyForm: {
        userNo: '',
        username: '',
        nickname: '',
        password: '',
        mobileNo: '',
        email: ''
      },
      userModifyFormRules: {
        username: [{ required: true, message: '用户名称不能为空', trigger: 'blur' }],
        nickname: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
        mobileNo: [{ required: false }],
        email: [{ required: false }]
      }
    }
  },
  methods: {
    query() {
      const queryConditions = this.queryConditions
      queryConditions.page = this.currentPage
      queryConditions.pageSize = this.pageSize
      User.getUserList(queryConditions).then(response => {
        const { result } = response
        this.tableData = result['dataSet']
        this.totalSize = result['totalSize']
      }).catch(() => {
      })
    },
    resetQueryConditions() {
      Object.keys(this.queryConditions).forEach(key => {
        this.queryConditions[key] = ''
      })
    },
    handlePageSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentPageChange(val) {
      this.currentPage = val
      this.query()
    },
    submitRegisterForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          User.register(this.registerForm).then(response => {
            if (response.success) {
              this.$message({ message: '注册成功', type: 'info', duration: 2 * 1000 })
              // 关闭dialog
              this.registerDialogVisible = false
              // 重新查询列表
              this.query()
            }
          }).catch(() => {
          })
        } else {
          this.$message({ message: '数据校验不通过', type: 'error', duration: 2 * 1000 })
          return false
        }
      })
    },
    submitModifyForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('确定修改用户信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            User.modifyUser(this.userModifyForm).then(response => {
              if (response.success) {
                this.$message({ message: '更新用户信息成功', type: 'info', duration: 2 * 1000 })
                // 关闭dialog
                this.modifyDialogVisible = false
                // 重新查询列表
                this.query()
              }
            }).catch(() => {
            })
          }).catch(() => {
          })
        } else {
          this.$message({ message: '数据校验不通过', type: 'error', duration: 2 * 1000 })
          return false
        }
      })
    },
    modifyUserState(row, state) {
      const stateMsg = state === 'DISABLE' ? '禁用' : '启用'
      this.$confirm(`确定${stateMsg}该用户?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        User.modifyUserState({ userNo: row.userNo, state: state }).then(response => {
          if (response.success) {
            this.$message({ message: `${stateMsg}用户成功`, type: 'info', duration: 2 * 1000 })
            // 重新查询列表
            this.query()
          }
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    resetPassword(row) {
      this.$confirm('确定重置用户密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        User.resetPassword({ userNo: row.userNo }).then(response => {
          if (response.success) {
            this.$message({ message: '重置用户密码成功', type: 'info', duration: 2 * 1000 })
          }
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    disableUser(row) {
      this.$confirm('将永久删除该用户, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        User.deleteUser({ userNo: row.userNo }).then(response => {
          if (response.success) {
            this.$message({ message: '删除用户成功', type: 'info', duration: 2 * 1000 })
            // 重新查询列表
            this.query()
          }
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    openModifyDialogVisible(row) {
      this.modifyDialogVisible = true
      this.userModifyForm = { ...row }
    }
  }
}
</script>

<style lang="scss" scoped>
  .user-manager-container {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;

    height: 100%;
    padding: 20px;

    .el-divider--horizontal {
      margin: 10px 0
    }
  }

  .query-conditions-container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    padding: 12px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }

  .condition-items {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    flex: none;
  }

  .condition-item {
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
    color: #909399;
    font-size: 14px;
    width: 20rem;
    padding-right: 24px;
    padding-bottom: 12px;
  }

  .query-buttons-container {
    display: flex;
    justify-content: space-between;
  }

  .query-buttons {
    display: flex;
    justify-content: center;
  }

  .table-container {
    display: flex;
    flex-direction: column;
    height: 100%;

    padding: 12px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }

  .pagination-container {
    padding-top: 12px;
    padding-bottom: 12px;
  }
</style>
