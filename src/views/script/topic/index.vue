<template>
  <div class="scrollbar">
    <div class="topic-management-container">

      <div class="query-conditions-container">
        <div>查询条件</div>
        <el-divider />
        <div class="condition-topics">
          <condition-input v-model="queryConditions.topicNo" label="主题编号" class="condition-topic" />
          <condition-input v-model="queryConditions.topicName" label="主题名称" class="condition-topic" />
          <condition-input v-model="queryConditions.topicDesc" label="主题描述" class="condition-topic" />
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
          <el-table-column prop="topicNo" label="主题编号" min-width="150" />
          <el-table-column prop="topicName" label="主题名称" min-width="150" />
          <el-table-column prop="topicDesc" label="主题描述" min-width="150" />
          <el-table-column fixed="right" label="操作" min-width="150">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="openUserManagementDialog(row)">集合管理</el-button>
              <el-button type="text" size="small" @click="openModifyDialog(row)">编辑</el-button>
              <el-button type="text" size="small" @click="deleteTopic(row)">删除</el-button>
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

  </div>
</template>

<script>
import * as Topic from '@/api/script/topic'
import ConditionInput from '@/components/QueryCondition/condition-input'
import CreateForm from './components/create-form'
import ModifyForm from './components/modify-form'

export default {
  name: 'Topic',
  components: { ConditionInput, CreateForm, ModifyForm },
  data() {
    return {
      // 查询条件
      queryConditions: {
        topicNo: '',
        topicName: '',
        topicDesc: ''
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
      Topic.queryTopicList(
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
    deleteTopic(row) {
      this.$confirm('删除该主题, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Topic.deleteTopic({ topicNo: row.topicNo }).then(response => {
          if (response.success) {
            this.$message({ message: '删除主题成功', type: 'info', duration: 2 * 1000 })
            // 重新查询列表
            this.query()
          }
        }).catch(() => {})
      }).catch(() => {})
    },
    openUserManagementDialog(row) {
      //
    },
    openModifyDialog(row) {
      this.modifyDialogVisible = true
      this.currentRow = { ...row }
    }
  }
}
</script>

<style lang="scss" scoped>
  .topic-management-container {
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

  .condition-topics {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    flex: none;
  }

  .condition-topic {
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
