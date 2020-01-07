<template>
  <scrollbar class="app-main-container">
    <div class="user-list-container">

      <div class="query-conditions">
        <div>查询条件</div>
        <el-divider />
        <div class="condition-items">
          <el-input v-model="queryConditions.userNo" class="condition-item">
            <template slot="prepend">用户编号</template>
          </el-input>
          <el-input v-model="queryConditions.username" class="condition-item">
            <template slot="prepend">用户名称</template>
          </el-input>
          <el-input v-model="queryConditions.nickname" class="condition-item">
            <template slot="prepend">用户昵称</template>
          </el-input>
          <el-input v-model="queryConditions.mobileNo" class="condition-item">
            <template slot="prepend">手机号</template>
          </el-input>
          <el-input v-model="queryConditions.email" class="condition-item">
            <template slot="prepend">邮箱地址</template>
          </el-input>
          <el-input v-model="queryConditions.state" class="condition-item">
            <template v-slot:prepend>用户状态</template>
          </el-input>
          <el-select v-model="queryConditions.state" placeholder="请选择" :clearable="true" class="condition-item">
            <template v-slot:prefix>用户状态</template>
            <el-option
              v-for="(value, key) in UserState"
              :key="key"
              :label="value"
              :value="value"
            />
          </el-select>
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
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="openUpdateDialogVisible(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.status='NORMAL'" type="text" size="mini" @click="disableUser">禁用</el-button>
              <el-button v-else size="small" @click="disableUser">启用</el-button>
              <el-button type="text" size="small" @click="disableUser">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination">
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

    <el-dialog
      title="用户注册"
      width="50%"
      :visible.sync="registerDialogVisible"
      :before-close="handleClose"
    >
      <el-form
        ref="registerForm"
        :model="registerForm"
        :rules="registerFormRules"
        label-width="100px"
        style="width: 80%"
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
          <el-button @click="resetForm('registerForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="编辑用户"
      width="50%"
      :visible.sync="modifyDialogVisible"
      :before-close="handleClose"
    >
      <el-form
        ref="userModifyForm"
        :model="userModifyForm"
        :rules="userModifyFormRules"
        label-width="100px"
        style="width: 80%"
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
          <el-button @click="resetForm('userModifyForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </scrollbar>
</template>

<script>
import { Message } from 'element-ui'
import * as User from '@/api/user'
import { UserState } from '@/api/enum'

export default {
  name: 'UserList',
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
    disableUser(row) {
      Message({
        message: '还没实现呢',
        type: 'error',
        duration: 5 * 1000
      })
    },
    submitRegisterForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          User.register(this.registerForm).then(response => {
            const { success } = response
            if (success) {
              Message({
                message: '注册成功',
                type: 'info',
                duration: 2 * 1000
              })
              // 关闭dialog
              this.registerDialogVisible = false
              // 重新查询列表
              this.query()
            }
          })
        } else {
          Message({
            message: '数据校验不通过',
            type: 'error',
            duration: 2 * 1000
          })
          return false
        }
      })
    },
    submitModifyForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          User.modifyUser(this.userModifyForm).then(response => {
            const { success } = response
            if (success) {
              Message({
                message: '更新用户信息成功',
                type: 'info',
                duration: 2 * 1000
              })
              // 关闭dialog
              this.modifyDialogVisible = false
              // 重新查询列表
              this.query()
            }
          })
        } else {
          Message({
            message: '数据校验不通过',
            type: 'error',
            duration: 2 * 1000
          })
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    openUpdateDialogVisible(row) {
      this.modifyDialogVisible = true
      this.userModifyForm = { ...row }
    },
    handleClose(done) {
      done()
    }
  }
}
</script>

<style lang="scss" scoped>
  .user-list-container {
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

  .query-conditions {
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

  .pagination {
    padding-top: 12px;
    padding-bottom: 12px;
  }
</style>
