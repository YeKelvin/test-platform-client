<template>
  <div class="scrollbar view-container">
    <div class="query-conditions-container">
      <div>查询条件</div>
      <el-divider />
      <div class="condition-items">
        <condition-input v-model="queryConditions.actionDesc" label="操作描述" class="condition-item" />
        <condition-input v-model="queryConditions.actionMethod" label="操作方法" class="condition-item" />
        <condition-input v-model="queryConditions.actionEndpoint" label="操作路由" class="condition-item" />
        <condition-input v-model="queryConditions.createdBy" label="操作人" class="condition-item" />
        <condition-datetime-picker v-model="queryConditions.startTime" label="开始时间" class="condition-item" />
        <condition-datetime-picker v-model="queryConditions.endTime" label="结束时间" class="condition-item" />
      </div>
      <div class="query-buttons">
        <el-button type="primary" size="small" @click="query">查询</el-button>
        <el-button size="small" @click="resetQueryConditions">重置</el-button>
      </div>
    </div>

    <div class="table-container">
      <div>查询结果</div>
      <el-divider />
      <el-table
        style="width: 100%; height: 100px;"
        height="150"
        :data="tableData"
        :border="true"
        :stripe="true"
        :fit="true"
        :highlight-current-row="true"
      >
        <el-table-column prop="actionDesc" label="操作描述" min-width="150" />
        <el-table-column prop="actionMethod" label="请求方法" min-width="150" />
        <el-table-column prop="actionEndpoint" label="请求路由" min-width="150" />
        <el-table-column prop="oldValue" label="旧值" min-width="150" />
        <el-table-column prop="newValue" label="新值" min-width="150" />
        <el-table-column prop="createdBy" label="操作人" min-width="150" />
        <el-table-column prop="createdTime" label="操作时间" min-width="150" />
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
</template>

<script>
import * as System from '@/api/system'
import ConditionInput from '@/components/QueryCondition/condition-input'
import ConditionDatetimePicker from '@/components/QueryCondition/condition-datetime-picker'

export default {
  name: 'ActionLog',
  components: { ConditionInput, ConditionDatetimePicker },
  data() {
    return {
      // 查询条件
      queryConditions: {
        actionDesc: '',
        actionMethod: '',
        actionEndpoint: '',
        createdBy: '',
        startTime: '',
        endTime: ''
      },
      // 表格数据
      tableData: [],
      // 分页信息
      page: 1,
      pageSize: 10,
      totalSize: 0,
      createDialogVisible: false
    }
  },
  methods: {
    query() {
      System.queryActionLogList(
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
    }
  }
}
</script>

<style lang="scss" scoped>
.view-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

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
  flex: none;
  flex-wrap: wrap;
  justify-content: flex-start;
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
  flex: 1;
  flex-direction: column;

  height: 100%;
  padding: 12px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}

.pagination-container {
  flex-shrink: 0;

  padding-top: 12px;
  padding-bottom: 12px;
}
</style>
