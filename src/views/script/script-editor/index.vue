<template>
  <scrollbar class="app-main-container">
    <div class="script-editor-container">
      <div class="element-sidebar-container">
        <el-input
          v-model="searchKeyword"
          placeholder="测试集合 | 测试案例 | 取样器"
          prefix-icon="el-icon-search"
          @keyup.enter.native="handleEnterSearch"
        />
        <el-tabs v-model="elementSidebarTabActiveName" :stretch="true" @tab-click="handleElementSidebarTabClick">
          <el-tab-pane label="测试集合" name="collection">
            <div class="collection-operation-button-container">
              <el-button type="text" icon="el-icon-plus" @click="addCreateCollectionTab">新增</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" icon="el-icon-delete">删除</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" icon="el-icon-copy-document">复制</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" icon="el-icon-bottom-left">粘贴</el-button>
            </div>
            <el-divider />
            <div class="collection-list-container">
              <ul class="collection-list-container">
                <li v-for="collection in collectionList" :key="collection.elementNo">
                  {{ collection.elementName }}
                </li>
              </ul>
            </div>
          </el-tab-pane>
          <el-tab-pane label="测试案例" name="group">
            <div class="collection-operation-button-container">
              <el-button type="text" icon="el-icon-plus" @click="addCreateGroupTab">新增</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" icon="el-icon-delete">删除</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" icon="el-icon-copy-document">复制</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" icon="el-icon-bottom-left">粘贴</el-button>
            </div>
            <el-divider />
          </el-tab-pane>
          <el-tab-pane label="取样器" name="sampler">
            <div class="collection-operation-button-container">
              <el-button type="text" icon="el-icon-plus" @click="addCreateSamplerTab">新增</el-button>
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

      <div class="editor-main-container">
        <el-tabs v-model="editElementTabActiveName" type="card" @tab-remove="removeTab">
          <el-tab-pane
            v-for="element in editElementTabs"
            :key="`${element.elementNo}::${element.elementName}::${element.elementType}}`"
            :label="element.elementName"
            :name="`${element.elementNo}::${element.elementName}`"
            :closable="element.elementType !=='activity'"
            style="height: 100%"
          >
            <keep-alive>
              <component
                :is="elementViews[element.elementType]"
                :item-no="itemNo"
                :element-no="element.elementNo"
                :action="element.action"
                @re-query-collection="queryCollectionByItem"
                @close-tab="removeTab(`${element.elementNo}::${element.elementName}`)"
              />
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </scrollbar>
</template>

<script>
import * as Element from '@/api/script/element'
import ActivityView from './components/activity-view'
import CollectionEditor from './components/collection-editor'
import GroupEditor from './components/group-editor.vue'
import SamplerMainEditor from './components/sampler-main-editor'

export default {
  name: 'ScriptEditor',

  components: { ActivityView, CollectionEditor, GroupEditor, SamplerMainEditor },

  data() {
    return {
      itemNo: '',
      searchKeyword: '',
      elementSidebarTabActiveName: 'collection',
      collectionList: [],
      groupList: [],
      samplerList: [],
      elementViews: {
        activity: 'ActivityView',
        collection: 'CollectionEditor',
        group: 'GroupEditor',
        sampler: 'SamplerMainEditor'
      },
      editElementTabActiveNo: '0',
      editElementTabActiveName: '0::动态',
      editElementTabs: [
        {
          elementNo: '0',
          elementName: '动态',
          elementType: 'activity',
          action: 'QUERY'
        }
      ]
    }
  },

  mounted: function() {
    // 存储路由跳转时传递的itemNo
    this.itemNo = this.$route.params.itemNo
    this.queryCollectionAll()
  },

  methods: {
    handleEnterSearch(event, keyword) {
      //
    },
    handleElementSidebarTabClick(tab, event) {
      //
    },
    addTab(elementNo, elementName, elementType, action) {
      const tabs = this.editElementTabs
      const newTabName = `${elementNo}::${elementName}`
      let isAllowAdd = true
      tabs.forEach(tab => {
        const tabName = `${tab.elementNo}::${tab.elementName}`
        if (tabName === newTabName) {
          isAllowAdd = false
        }
      })
      if (isAllowAdd) {
        this.editElementTabs.push({
          elementNo: elementNo,
          elementName: elementName,
          elementType: elementType,
          action: action
        })
        this.editElementTabActiveNo = elementNo
        this.editElementTabActiveName = `${elementNo}::${elementName}`
      }
    },
    removeTab(removeTabName) {
      const tabs = this.editElementTabs
      let activeNo = ''
      let activeName = ''
      const activeTabName = this.editElementTabActiveName
      if (activeTabName === removeTabName) {
        tabs.forEach((tab, index) => {
          const tabName = `${tab.elementNo}::${tab.elementName}`
          if (tabName === removeTabName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeNo = nextTab.elementNo
              activeName = nextTab.elementName
            }
          }
        })
      }

      this.editElementTabActiveNo = activeNo
      this.editElementTabActiveName = `${activeNo}::${activeName}`
      this.editElementTabs = tabs.filter(tab => `${tab.elementNo}::${tab.elementName}` !== removeTabName)
    },
    addCreateCollectionTab() {
      this.addTab('0', '新增集合', 'collection', 'CREATE')
    },
    addCreateGroupTab() {
      this.addTab('0', '新增案例', 'group', 'CREATE')
    },
    addCreateSamplerTab() {
      this.addTab('0', '新增取样器', 'sampler', 'CREATE')
    },
    queryCollectionAll() {
      Element.queryElementAll({ itemNo: this.itemNo, elementType: 'COLLECTION' }).then(response => {
        const { result } = response
        this.collectionList = result
      }).catch(() => {})
    },
    queryGroupByCollection(elementNo) {
      Element.queryElementChild({ elementNo: elementNo, elementType: 'GROUP' }).then(response => {
        const { result } = response
        this.groupList = result
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
