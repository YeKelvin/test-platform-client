<template>
  <scrollbar class="app-main-container">
    <div class="permission-management-container">

      <div class="query-conditions-container">
        <div>查询条件</div>
        <el-divider />
        <div class="condition-items">
          <condition-input v-model="queryConditions.permissionNo" label="权限编号" class="condition-item" />
          <condition-input v-model="queryConditions.permissionName" label="权限名称" class="condition-item" />
          <condition-input v-model="queryConditions.endpoint" label="请求路由" class="condition-item" />
          <condition-select v-model="queryConditions.method" :options="HttpMethods" label="请求方法" class="condition-item" />
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
          style="width: 100%"
          height="150"
          :data="tableData"
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
              <el-button type="text" size="small" @click="openModifyDialog(row)">编辑</el-button>
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
          :current-page="page"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="pageSize"
          :total="totalSize"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange"
        />
      </div>
    </div>

    <create-form :visible.sync="createDialogVisible" @re-query="query" />
    <modify-form :visible.sync="modifyDialogVisible" :current-row="currentRow" @re-query="query" />

  </scrollbar>
</template>

<script>
import * as User from '@/api/user'
import { PermissionState, HttpMethods } from '@/api/enum'
import ConditionInput from '@/components/QueryCondition/condition-input'
import ConditionSelect from '@/components/QueryCondition/condition-select'
import CreateForm from './components/create-form'
import ModifyForm from './components/modify-form'

export default {
  name: 'PermissionManagement',
  components: { ConditionInput, ConditionSelect, CreateForm, ModifyForm },
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
      page: 1,
      pageSize: 10,
      totalSize: 0,
      currentRow: {},
      createDialogVisible: false,
      modifyDialogVisible: false
    }
  },
  methods: {
    query() {
      User.queryPermissionList(
        { ...this.queryConditions, page: this.page, pageSize: this.pageSize }
      ).then(response => {
        const { result } = response
        this.tableData = result['dataSet']
        this.totalSize = result['totalSize']
      }).catch(() => {})
    },
    resetQueryConditions() {
      Object.keys(this.queryConditions).forEach(key => {
        this.queryConditions[key] = ''
      })
    },
    handlePageSizeChange(val) {
      this.pageSize = val
      this.query()
    },
    handleCurrentPageChange(val) {
      this.page = val
      this.query()
    },
    modifyPermissionState(row, state) {
      const stateMsg = state === 'DISABLE' ? '禁用' : '启用'
      this.$confirm(`${stateMsg}该权限，是否继续?`, '警告', {
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
        }).catch(() => {})
      }).catch(() => {})
    },
    disablePermission(row) {
      this.$confirm('删除该权限, 是否继续?', '警告', {
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
        }).catch(() => {})
      }).catch(() => {})
    },
    openModifyDialog(row) {
      this.modifyDialogVisible = true
      this.currentRow = { ...row }
    }
  }
}
</script>

<style lang="scss" scoped>
  .permission-management-container {
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
