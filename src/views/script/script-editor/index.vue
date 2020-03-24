<template>
  <scrollbar class="app-main-container">
    <div class="script-editor-container">
      <div class="element-sidebar-container">
        <el-input
          v-model="searchKeyword"
          placeholder="测试集合 | 测试案例 | 测试步骤"
          prefix-icon="el-icon-search"
          @keyup.enter.native="handleEnterSearch"
        />
        <el-tabs v-model="elementSidebarTabActiveName" :stretch="true" @tab-click="handleElementSidebarTabClick">
          <el-tab-pane label="测试集合" name="collection">
            <div class="collection-operation-button-container">
              <el-button type="text" icon="el-icon-plus">新增</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" icon="el-icon-delete">删除</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" icon="el-icon-copy-document">复制</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" icon="el-icon-bottom-left">粘贴</el-button>
            </div>
            <el-divider />
          </el-tab-pane>
          <el-tab-pane label="测试案例" name="group">测试案例</el-tab-pane>
          <el-tab-pane label="测试步骤" name="sampler">测试步骤</el-tab-pane>
        </el-tabs>
      </div>
      <div class="editor-main-container">
        <p>searchKeyword: {{ searchKeyword }}</p>
        <p>elementSidebarTabActiveName: {{ elementSidebarTabActiveName }}</p>
      </div>
    </div>
  </scrollbar>
</template>

<script>
export default {
  name: 'ScriptEditor',

  data() {
    return {
      itemNo: '',
      searchKeyword: '',
      elementSidebarTabActiveName: 'collection'
    }
  },

  mounted: function() {
    this.itemNo = this.$route.params.itemNo
  },

  methods: {
    handleEnterSearch(event, keyword) {
      console.log(keyword)
    },
    handleElementSidebarTabClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style lang="scss" scoped>
  .script-editor-container {
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: space-between;

    height: 100%;
    padding: 20px;

    .el-divider--horizontal {
      margin: 10px 0
    }
  }

  .element-sidebar-container{
    display: flex;
    flex: 1;
    flex-direction: column;
    max-width: 400px;
    padding: 12px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

  }

  .collection-operation-button-container{
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;

    .el-button--text {
        padding-top: 6px;
        padding-bottom: 6px;
    }
  }

  .editor-main-container{
    display: flex;
    flex: 1;
    flex-direction: column;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    margin-left: 12px;
    background-color:#5a5e66;
  }
</style>
