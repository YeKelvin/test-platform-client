<template>
  <div class="app-container">
    <span>
      用户编号:
      <el-input v-model="queryConditions.userNo" placeholder="userNo" />
    </span>
    <div>
      用户名称:
      <el-input v-model="queryConditions.userName" placeholder="userName" />
    </div>
    <div>
      用户昵称:
      <el-input v-model="queryConditions.nickName" placeholder="nickName" />
    </div>
    <div>
      手机号:
      <el-input v-model="queryConditions.mobileNo" placeholder="mobileNo" />
    </div>
    <div>
      邮箱地址:
      <el-input v-model="queryConditions.email" placeholder="email" />
    </div>
    <div>
      用户状态:
      <el-input v-model="queryConditions.state" placeholder="state" />
    </div>
    <div>
      <el-button type="primary" @click="query">查询</el-button>
      <el-button type="primary" @click="reset">重置</el-button>
    </div>
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

<style scoped>

</style>
