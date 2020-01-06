<template>
  <scrollbar class="app-main-container">
    <div class="user-list-container">

      <div class="query-conditions">
        <div>查询条件</div>
        <el-divider />
        <div class="condition-items">
          <el-input v-model="queryConditions.permissionNo" placeholder="permissionNo" class="condition-item">
            <template slot="prepend">权限编号:</template>
          </el-input>
          <el-input v-model="queryConditions.permissionName" placeholder="permissionName" class="condition-item">
            <template slot="prepend">权限名称:</template>
          </el-input>
          <el-input v-model="queryConditions.endpoint" placeholder="endpoint" class="condition-item">
            <template slot="prepend">请求路由:</template>
          </el-input>
          <el-input v-model="queryConditions.method" placeholder="method" class="condition-item">
            <template slot="prepend">请求方法:</template>
          </el-input>
          <el-input v-model="queryConditions.state" placeholder="state" class="condition-item">
            <template slot="prepend">权限状态:</template>
          </el-input>
        </div>
        <div class="query-buttons-container">
          <div />
          <div class="query-buttons">
            <el-button type="primary" @click="query">查询</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
          </div>
          <el-button type="primary">新增</el-button>
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
              <el-button type="text" size="small" @click="updatePermission">编辑</el-button>
              <el-button v-if="scope.row.status='NORMAL'" type="text" size="mini" @click="disable">禁用</el-button>
              <el-button v-else size="small" @click="disable">启用</el-button>
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
    <el-dialog class="create-container"></el-dialog>
    <el-dialog class="update-container"></el-dialog>
  </scrollbar>
</template>

<script>
import { Message } from 'element-ui'
import * as User from '@/api/user'

export default {
  name: 'PermissionList',
  data() {
    return {
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
      totalSize: 0
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
    reset() {
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
    disable() {
      Message({
        message: '还没实现呢',
        type: 'error',
        duration: 5 * 1000
      })
    },
    updatePermission() {
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
