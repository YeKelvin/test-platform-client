<template>
  <scrollbar class="app-main-container">
    <div class="user-role-manager-container">

      <div class="query-conditions-container">
        <div>查询条件</div>
        <el-divider />
        <div class="condition-items">
          <condition-input v-model="queryConditions.userNo" label="用户编号" class="condition-item" />
          <condition-input v-model="queryConditions.roleNo" label="角色编号" class="condition-item" />
          <condition-input v-model="queryConditions.username" label="用户名称" class="condition-item" />
          <condition-input v-model="queryConditions.roleName" label="角色名称" class="condition-item" />
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
          <el-table-column prop="userNo" label="用户编号" min-width="150" />
          <el-table-column prop="roleNo" label="角色编号" min-width="150" />
          <el-table-column prop="username" label="用户名称" min-width="150" />
          <el-table-column prop="roleName" label="角色名称" min-width="150" />
          <el-table-column fixed="right" label="操作" min-width="150">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="disableRel(row)">删除</el-button>
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

    <create-form :visible.sync="createDialogVisible" @re-query="query" />

  </scrollbar>
</template>

<script>
import * as User from '@/api/user'
import ConditionInput from '@/components/QueryCondition/condition-input'
import CreateForm from './components/create-form'

export default {
  name: 'UserRoleRelList',
  components: { ConditionInput, CreateForm },
  data() {
    return {
      // 查询条件
      queryConditions: {
        userNo: '',
        roleNo: '',
        username: '',
        roleName: ''
      },
      // 表格数据
      tableData: [],
      // 分页信息
      currentPage: 1,
      pageSize: 10,
      totalSize: 0,
      createDialogVisible: false
    }
  },
  methods: {
    query() {
      const queryConditions = this.queryConditions
      queryConditions.page = this.currentPage
      queryConditions.pageSize = this.pageSize
      User.getUserRoleRelList(queryConditions).then(response => {
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
      this.currentPage = val
      this.query()
    },
    disableRel(row) {
      this.$confirm('删除该用户角色关联关系, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        User.deleteUserRoleRel({ userNo: row.userNo, roleNo: row.roleNo }).then(response => {
          if (response.success) {
            this.$message({ message: '删除用户角色关联关系成功', type: 'info', duration: 2 * 1000 })
            // 重新查询列表
            this.query()
          }
        }).catch(() => {})
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
  .user-role-manager-container {
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
