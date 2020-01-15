<template>
  <scrollbar class="app-main-container">
    <div class="role-manager-container">

      <div class="query-conditions-container">
        <div>查询条件</div>
        <el-divider />
        <div class="condition-items">
          <condition-input v-model="queryConditions.roleNo" label="角色编号" class="condition-item" />
          <condition-input v-model="queryConditions.roleName" label="角色名称" class="condition-item" />
          <condition-select v-model="queryConditions.state" :options="RoleState" label="角色状态" class="condition-item" />
          <condition-input v-model="queryConditions.remark" label="角色备注" class="condition-item" />
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
          <el-table-column prop="roleNo" label="角色编号" min-width="150" />
          <el-table-column prop="roleName" label="角色名称" min-width="150" />
          <el-table-column prop="state" label="状态" min-width="150" />
          <el-table-column prop="remark" label="备注" min-width="150" />
          <el-table-column fixed="right" label="操作" min-width="150">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="openModifyDialog(row)">编辑</el-button>
              <el-button v-if="row.state==='NORMAL'" type="text" size="small" @click="modifyRoleState(row,'DISABLE')">
                禁用
              </el-button>
              <el-button v-else type="text" size="small" @click="modifyRoleState(row,'NORMAL')">启用</el-button>
              <el-button type="text" size="small" @click="disableRole(row)">删除</el-button>
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
    <modify-form :visible.sync="modifyDialogVisible" :current-row="currentRow" @re-query="query" />

  </scrollbar>
</template>

<script>
import * as User from '@/api/user'
import { RoleState } from '@/api/enum'
import ConditionInput from '@/components/QueryCondition/condition-input'
import ConditionSelect from '@/components/QueryCondition/condition-select'
import CreateForm from './components/create-form'
import ModifyForm from './components/modify-form'

export default {
  name: 'RoleList',
  components: { ConditionInput, ConditionSelect, CreateForm, ModifyForm },
  data() {
    return {
      // 查询条件
      RoleState: RoleState,
      queryConditions: {
        roleNo: '',
        roleName: '',
        state: '',
        remark: ''
      },
      // 表格数据
      tableData: [],
      // 分页信息
      currentPage: 1,
      pageSize: 10,
      totalSize: 0,
      currentRow: {},
      createDialogVisible: false,
      modifyDialogVisible: false
    }
  },
  methods: {
    query() {
      const queryConditions = this.queryConditions
      queryConditions.page = this.currentPage
      queryConditions.pageSize = this.pageSize
      User.getRoleList(queryConditions).then(response => {
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
    modifyRoleState(row, state) {
      const stateMsg = state === 'DISABLE' ? '禁用' : '启用'
      this.$confirm(`确定${stateMsg}该角色?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        User.modifyRoleState({ roleNo: row.roleNo, state: state }).then(response => {
          if (response.success) {
            this.$message({ message: `${stateMsg}角色成功`, type: 'info', duration: 2 * 1000 })
            // 重新查询列表
            this.query()
          }
        }).catch(() => {})
      }).catch(() => {})
    },
    disableRole(row) {
      this.$confirm('将永久删除该角色, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        User.deleteRole({ roleNo: row.roleNo }).then(response => {
          if (response.success) {
            this.$message({ message: '删除角色成功', type: 'info', duration: 2 * 1000 })
            // 重新查询列表
            this.query()
          }
        }).catch(() => {})
      }).catch(() => {})
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    openModifyDialog(row) {
      this.modifyDialogVisible = true
      this.currentRow = { ...row }
    }
  }
}
</script>

<style lang="scss" scoped>
  .role-manager-container {
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
