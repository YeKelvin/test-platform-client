<template>
  <scrollbar class="app-main-container">
    <div class="permission-manager-container">

      <div class="query-conditions-container">
        <div>查询条件</div>
        <el-divider />
        <div class="condition-items">
          <condition-input v-model="queryConditions.permissionNo" label="权限编号" class="condition-item" />
          <condition-input v-model="queryConditions.permissionName" label="权限名称" class="condition-item" />
          <condition-input v-model="queryConditions.endpoint" label="请求路由" class="condition-item" />
          <condition-input v-model="queryConditions.method" label="请求方法" class="condition-item" />
          <condition-select v-model="queryConditions.state" :options="PermissionState" label="权限状态" class="condition-item" />
        </div>
        <div class="query-buttons-container">
          <div />
          <div class="query-buttons">
            <el-button type="primary" @click="query">查询</el-button>
            <el-button @click="resetQueryConditions">重置</el-button>
          </div>
          <el-button type="primary" @click="createDialogVisible=true">新增</el-button>
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
          <el-table-column prop="permissionNo" label="权限编号" min-width="150" />
          <el-table-column prop="permissionName" label="权限名称" min-width="150" />
          <el-table-column prop="endpoint" label="请求路由" min-width="150" />
          <el-table-column prop="method" label="请求方法" min-width="150" />
          <el-table-column prop="state" label="状态" min-width="150" />
          <el-table-column fixed="right" label="操作" min-width="150">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="openModifyDialogVisible(row)">编辑</el-button>
              <el-button v-if="row.state==='NORMAL'" type="text" size="small" @click="modifyPermissionState(row,'DISABLE')">
                禁用
              </el-button>
              <el-button v-else type="text" size="small" @click="modifyPermissionState(row,'NORMAL')">启用</el-button>
              <el-button type="text" size="small" @click="disablePermission(row)">删除</el-button>
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

    <el-dialog title="新增权限" width="50%" :visible.sync="createDialogVisible">
      <el-form
        ref="createForm"
        label-width="100px"
        style="width: 80%"
        :model="createForm"
        :rules="createFormRules"
      >
        <el-form-item label="权限名称：" prop="permissionName">
          <el-input v-model="createForm.permissionName" />
        </el-form-item>
        <el-form-item label="请求路由：" prop="endpoint">
          <el-input v-model="createForm.endpoint" />
        </el-form-item>
        <el-form-item label="请求方法：" prop="method">
          <el-select v-model="modifyForm.method" :clearable="true" style="width: 100%;">
            <el-option
              v-for="(value, key) in HttpMethods"
              :key="key"
              :label="value"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitCreateForm('createForm')">新增</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="编辑权限" width="50%" :visible.sync="modifyDialogVisible">
      <el-form
        ref="modifyForm"
        label-width="100px"
        style="width: 80%"
        :model="modifyForm"
        :rules="modifyFormRules"
      >
        <el-form-item label="权限名称：" prop="permissionName">
          <el-input v-model="modifyForm.permissionName" />
        </el-form-item>
        <el-form-item label="请求路由：" prop="endpoint">
          <el-input v-model="modifyForm.endpoint" />
        </el-form-item>
        <el-form-item label="请求方法：" prop="method">
          <el-select v-model="modifyForm.method" :clearable="true" style="width: 100%;">
            <el-option
              v-for="(value, key) in HttpMethods"
              :key="key"
              :label="value"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitModifyForm('modifyForm')">更新</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </scrollbar>
</template>

<script>
import * as User from '@/api/user'
import { PermissionState, HttpMethods } from '@/api/enum'
import ConditionInput from '@/components/QueryCondition/condition-input'
import ConditionSelect from '@/components/QueryCondition/condition-select'

export default {
  name: 'PermissionList',
  components: { ConditionInput, ConditionSelect },
  data() {
    return {
      // 查询条件
      PermissionState: PermissionState,
      HttpMethods: HttpMethods,
      queryConditions: {
        permissionNo: '',
        permissionName: '',
        endpoint: '',
        method: '',
        state: ''
      },
      // 表格数据
      tableData: [],
      // 分页信息
      currentPage: 1,
      pageSize: 10,
      totalSize: 0,
      // 用户注册 dialog相关属性
      createDialogVisible: false,
      createForm: {
        permissionName: '',
        endpoint: '',
        method: ''
      },
      createFormRules: {
        permissionName: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        endpoint: [{ required: true, message: '请求路由不能为空', trigger: 'blur' }],
        method: [{ required: true, message: '请求方法不能为空', trigger: 'blur' }]
      },
      // 用户编辑 dialog相关属性
      modifyDialogVisible: false,
      modifyForm: {
        permissionNo: '',
        permissionName: '',
        endpoint: '',
        method: ''
      },
      modifyFormRules: {
        permissionName: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        endpoint: [{ required: true, message: '请求路由不能为空', trigger: 'blur' }],
        method: [{ required: true, message: '请求方法不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    query() {
      const queryConditions = this.queryConditions
      queryConditions.page = this.currentPage
      queryConditions.pageSize = this.pageSize
      User.getPermissionList(queryConditions).then(response => {
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
    submitCreateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          User.createPermission(this.createForm).then(response => {
            if (response.success) {
              this.$message({ message: '新增权限成功', type: 'info', duration: 2 * 1000 })
              // 关闭dialog
              this.createDialogVisible = false
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
          this.$confirm('确定修改权限信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            User.modifyPermission(this.modifyForm).then(response => {
              if (response.success) {
                this.$message({ message: '更新权限成功', type: 'info', duration: 2 * 1000 })
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
    modifyPermissionState(row, state) {
      const stateMsg = state === 'DISABLE' ? '禁用' : '启用'
      this.$confirm(`确定${stateMsg}该权限?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        User.modifyPermissionState({ permissionNo: row.permissionNo, state: state }).then(response => {
          if (response.success) {
            this.$message({ message: `${stateMsg}权限成功`, type: 'info', duration: 2 * 1000 })
            // 重新查询列表
            this.query()
          }
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    disablePermission(row) {
      this.$confirm('将永久删除该权限, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        User.deletePermission({ permissionNo: row.permissionNo }).then(response => {
          if (response.success) {
            this.$message({ message: '删除权限成功', type: 'info', duration: 2 * 1000 })
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
      this.modifyForm = { ...row }
    }
  }
}
</script>

<style lang="scss" scoped>
  .permission-manager-container {
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
