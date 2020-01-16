<template>
  <scrollbar class="app-main-container">
    <div class="user-role-manager-container">

      <div class="query-conditions-container">
        <div>查询条件</div>
        <el-divider />
        <div class="condition-items">
          <condition-input v-model="queryConditions.actionDetail" label="操作描述" class="condition-item" />
          <condition-input v-model="queryConditions.actionPath" label="操作路径" class="condition-item" />
          <condition-input v-model="queryConditions.createdBy" label="操作人" class="condition-item" />
          <div class="condition-item">
            <label class="condition-label">开始时间</label>
            <el-date-picker v-model="queryConditions.startTime" type="datetime" />
          </div>
          <div class="condition-item">
            <label class="condition-label">结束时间</label>
            <el-date-picker v-model="queryConditions.endTime" type="datetime" />
          </div>
        </div>
        <div class="query-buttons">
          <el-button type="primary" @click="query">查询</el-button>
          <el-button @click="resetQueryConditions">重置</el-button>
        </div>
      </div>

      <div class="table-container">
        <div>查询结果</div>
        <el-divider />
        <el-table
          style="width: 100%"
          height="150"
          :data="dataSet"
          :border="true"
          :stripe="true"
          :fit="true"
          :highlight-current-row="true"
        >
          <el-table-column prop="actionDetail" label="操作描述" min-width="150" />
          <el-table-column prop="actionPath" label="操作路径" min-width="150" />
          <el-table-column prop="createdBy" label="操作人" min-width="150" />
          <el-table-column prop="createdTime" label="操作时间" min-width="150" />
          <el-table-column prop="remark" label="备注" min-width="150" />
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

  </scrollbar>
</template>

<script>
import * as System from '@/api/system'
import ConditionInput from '@/components/QueryCondition/condition-input'

export default {
  name: 'ActionLog',
  components: { ConditionInput },
  data() {
    return {
      // 查询条件
      queryConditions: {
        actionDetail: '',
        actionPath: '',
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
      System.getActionLogList(
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

  .condition-label{
    margin-right: 6px;
    width: fit-content;
    white-space: nowrap;
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
