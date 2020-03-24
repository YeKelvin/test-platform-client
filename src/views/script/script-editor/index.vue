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
        <el-tabs v-model="elementSidebarTabsActiveName" :stretch="true" @tab-click="handleElementSidebarTabClick">
          <el-tab-pane label="测试集合" name="collection">
            <div class="collection-operation-button-container">
              <el-button type="text" icon="el-icon-plus" @click="addTab(editElementTabsActiveName)">新增</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" icon="el-icon-delete">删除</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" icon="el-icon-copy-document">复制</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" icon="el-icon-bottom-left">粘贴</el-button>
            </div>
            <el-divider />
          </el-tab-pane>
          <el-tab-pane label="测试案例" name="group">
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
          <el-tab-pane label="测试步骤" name="sampler">
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
        </el-tabs>
      </div>

      <!--   编辑页   --><!--   编辑页   --><!--   编辑页   --><!--   编辑页   --><!--   编辑页   -->
      <div class="editor-main-container">
        <el-tabs v-model="editElementTabsActiveName" type="card" @tab-remove="removeTab">
          <el-tab-pane label="动态" name="activities">
            动态
          </el-tab-pane>
          <el-tab-pane
            v-for="(element, index) in editElementTabs"
            :key="index"
            :label="element.elementName"
            :name="element.elementName"
            closable
          >
            测试集合 | 测试组 | 测试取样器
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </scrollbar>
</template>

<script>
import * as Element from '@/api/script/element'
export default {
  name: 'ScriptEditor',

  data() {
    return {
      itemNo: '',
      searchKeyword: '',
      elementSidebarTabsActiveName: 'collection',
      collectionList: [],
      editElementTabsActiveName: 'activities',
      editElementTabs: [],
      tabIndex: 0
    }
  },

  mounted: function() {
    // 存储路由跳转时传递的itemNo
    this.itemNo = this.$route.params.itemNo
    // this.queryCollectionByItem()
  },

  methods: {
    handleEnterSearch(event, keyword) {
      console.log(keyword)
    },
    handleElementSidebarTabClick(tab, event) {
      console.log(tab, event)
    },
    addTab(targetName) {
      const newTabName = ++this.tabIndex + ''
      this.editElementTabs.push({
        elementNo: 'New Tab',
        elementName: newTabName
      })
      this.editElementTabsActiveName = newTabName
    },
    removeTab(targetName) {
      const tabs = this.editElementTabs
      let activeName = this.editElementTabsActiveName
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.elementName === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.elementName
            }
          }
        })
      }

      this.editElementTabsActiveName = activeName
      this.editElementTabs = tabs.filter(tab => tab.elementName !== targetName)
    },
    queryCollectionByItem() {
      Element.queryElementList({ itemNo: this.itemNo, elementType: 'COLLECTION' }).then(response => {
        const { result } = response
        this.collectionList = result
      }).catch(() => {})
    },
    createCollection(name, comments, propertys) {
      Element.createElement(
        {
          elementName: name,
          elementComments: comments,
          elementType: 'COLLECTION',
          propertys: propertys,
          itemNo: this.itemNo
        }
      ).then(response => {

      }).catch(() => {})
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
    margin-left: 6px;
  }
</style>
