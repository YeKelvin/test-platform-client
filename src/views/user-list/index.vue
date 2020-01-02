<template>
  <div class="app-container">
    <div class="query-conditions">
      <div>查询条件</div>
      <el-divider />
      <div class="condition-items">
        <el-input v-model="queryConditions.userNo" placeholder="userNo">
          <template slot="prepend">用户编号:</template>
        </el-input>

        <el-input v-model="queryConditions.userName" placeholder="userName">
          <template slot="prepend">用户名称:</template>
        </el-input>

        <el-input v-model="queryConditions.nickName" placeholder="nickName">
          <template slot="prepend">用户昵称:</template>
        </el-input>

        <el-input v-model="queryConditions.mobileNo" placeholder="mobileNo">
          <template slot="prepend">手机号:</template>
        </el-input>

        <el-input v-model="queryConditions.email" placeholder="email">
          <template slot="prepend">邮箱地址:</template>
        </el-input>

        <el-input v-model="queryConditions.state" placeholder="state">
          <template slot="prepend">用户状态:</template>
        </el-input>
      </div>
      <div class="query-buttons">
        <el-button type="primary" @click="query">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </div>
    </div>

    <div>查询结果</div>
    <el-divider />

    <el-table
      :data="tableData"
      style="width: 100%"
      height="400"
      border
    >
      <el-table-column prop="userNo" label="编号" width="150" />
      <el-table-column prop="userName" label="名称" width="120" />
      <el-table-column prop="nickName" label="昵称" width="120" />
      <el-table-column prop="mobileNo" label="手机号" width="120" />
      <el-table-column prop="email" label="邮箱" width="300" />
      <el-table-column prop="state" label="状态" width="120" />
      <el-table-column fixed="right" label="操作" width="120" />
    </el-table>
    <div class="block">
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
</template>

<script>
import * as User from '@/api/user'

export default {
  name: 'UserList',
  data() {
    return {
      queryConditions: {
        userNo: '',
        userName: '',
        nickName: '',
        mobileNo: '',
        email: '',
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
      User.getInfoList(queryConditions).then(response => {
        const { result } = response
        this.tableData = result['dataSet']
        this.totalSize = result['totalSize']
      }).catch(error => {
        console.error(error)
      })
    },
    reset() {
      this.queryConditions.userNo = ''
      this.queryConditions.userName = ''
      this.queryConditions.nickName = ''
      this.queryConditions.mobileNo = ''
      this.queryConditions.email = ''
      this.queryConditions.state = ''
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/flex.scss";
  .query-conditions{
    @include flexbox;
    @include flex-dir(column);
  }

  .condition-items{
    @include flexbox;
    @include flex-dir(row);
  }

  .query-buttons{
    @include flexbox;
    @include flex-dir(row);
  }
</style>
