<template>
  <scrollbar class="app-main-container">
    <div class="permission-manager-container">

      <div class="query-conditions">
        <div>查询条件</div>
        <el-divider />
        <div class="condition-items">
          <div class="condition-item">
            <label class="condition-label">权限编号</label>
            <el-input v-model="queryConditions.permissionNo" class="condition-item" />
          </div>
          <div class="condition-item">
            <label class="condition-label">权限名称</label>
            <el-input v-model="queryConditions.permissionName" class="condition-item" />
          </div>
          <div class="condition-item">
            <label class="condition-label">请求路由</label>
            <el-input v-model="queryConditions.endpoint" class="condition-item" />
          </div>
          <div class="condition-item">
            <label class="condition-label">请求方法</label>
            <el-input v-model="queryConditions.method" class="condition-item" />
          </div>
          <div class="condition-item">
            <label class="condition-label">权限状态</label>
            <el-select v-model="queryConditions.state" :clearable="true">
              <el-option
                v-for="(value, key) in PermissionState"
                :key="key"
                :label="value"
                :value="value"
              />
            </el-select>
          </div>
        </div>
        <div class="query-buttons-container">
          <div />
          <div class="query-buttons">
            <el-button type="primary" @click="query">查询</el-button>
            <el-button type="primary" @click="resetQueryConditions">重置</el-button>
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
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="openModifyDialogVisible(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.status='NORMAL'" type="text" size="mini" @click="disablePermission">禁用</el-button>
              <el-button v-else size="small" @click="disablePermission">启用</el-button>
              <el-button type="text" size="small" @click="deletePermission">删除</el-button>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog
      title="新增权限"
      width="50%"
      :visible.sync="createDialogVisible"
      :before-close="handleClose"
    />
    <el-dialog
      title="编辑权限"
      width="50%"
      :visible.sync="modifyDialogVisible"
      :before-close="handleClose"
    />
  </scrollbar>
</template>

<script>
import { Message } from 'element-ui'
import * as User from '@/api/user'
import { PermissionState } from '@/api/enum'

export default {
  name: 'PermissionList',
  data() {
    return {
      PermissionState: PermissionState,
      queryConditions: {
        permissionNo: '',
        permissionName: '',
        endpoint: '',
        method: '',
        state: ''
      },
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      totalSize: 0,

      createDialogVisible: false,
      permissionCreateForm: {},
      modifyDialogVisible: false,
      permissionModifyForm: {}
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
      })
    },
    resetQueryConditions() {
      Object.keys(this.queryConditions).forEach(key => {
        this.queryConditions[key] = ''
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.query()
    },
    disablePermission() {
      Message({
        message: '还没实现呢',
        type: 'error',
        duration: 5 * 1000
      })
    },
    deletePermission() {
      Message({
        message: '还没实现呢',
        type: 'error',
        duration: 5 * 1000
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    openModifyDialogVisible(row) {
      this.modifyDialogVisible = true
      this.permissionModifyForm = { ...row }
    },
    handleClose(done) {
      done()
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
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
    color: #909399;
    font-size: 14px;
    width: 20rem;
    padding-right: 24px;
    padding-bottom: 12px;

    .el-select{
      width: 100%;
    }
  }

  .condition-label{
    margin-right: 6px;
    width: fit-content;
    white-space: nowrap;
  }

  .query-buttons-container {
    display: flex;
    justify-content: space-between;
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
