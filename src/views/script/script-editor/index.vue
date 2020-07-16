<template>
  <scrollbar class="app-main-container">
    <div class="script-editor-container">
      <div class="element-sidebar-container">
        <el-tabs v-model="sidebarTabActiveName" :stretch="true">
          <el-tab-pane label="Collections" name="collection">
            <div class="collection-operation-container">
              <el-button type="text" icon="el-icon-plus" @click="openNewCollectionTab">新增脚本</el-button>
            </div>
            <el-divider />
            <div class="collection-list-container">
              <el-card
                v-for="collection in collectionList"
                :key="collection.elementNo"
                class="collection-card"
                :class="{'active-card':activeCollectionNo===collection.elementNo}"
                @click.native="clickCollectionCard(collection.elementNo, collection.elementName)"
                @dblclick.native="moveToGroupList"
              >
                <div class="collection-item">
                  {{ collection.elementName }}
                  <span v-if="!collection.enabled" style="margin-left: 10px">
                    <el-tag type="danger" size="mini">已禁用</el-tag>
                  </span>
                  <div class="more-operation-container">
                    <el-divider direction="vertical" />
                    <el-dropdown trigger="click" placement="bottom-start">
                      <i class="el-icon-more rotate-90" />
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-view" @click.native="openCollectionDetailTab">详情</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-video-play">运行</el-dropdown-item>
                        <el-dropdown-item v-if="collection.enabled" icon="el-icon-turn-off" @click.native="disableElement(collection.elementNo, collection.elementType)">禁用</el-dropdown-item>
                        <el-dropdown-item v-else icon="el-icon-turn-off" @click.native="enableElement(collection.elementNo, collection.elementType)">启用</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-delete" @click.native="deleteCollection(collection.elementNo)">删除</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
              </el-card>
            </div>
          </el-tab-pane>

          <el-tab-pane label="TestCases" name="group" :disabled="!activeCollectionNo&&!activeCollectionName">
            <div class="group-operation-container">
              <el-dropdown trigger="click" placement="bottom-start">
                <span class="el-dropdown-link">
                  <el-button type="text" icon="el-icon-plus">新增</el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="openNewGroupTab">测试案例</el-dropdown-item>
                  <el-dropdown-item divided @click.native="openNewHttpSamplerTab">HTTP请求</el-dropdown-item>
                  <el-dropdown-item>SQL请求</el-dropdown-item>
                  <el-dropdown-item divided>配置器</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-divider direction="vertical" />
              <el-button type="text" icon="el-icon-sort-up" @click="moveUpGroup">上移</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" icon="el-icon-sort-down" @click="moveDownGroup">下移</el-button>
            </div>
            <el-divider />
            <script-tree ref="scriptTree" :script-no="activeCollectionNo" />
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="editor-main-container">
        <el-tabs v-model="editTabActiveName" type="card" @tab-remove="removeTab">
          <el-tab-pane
            v-for="tab in editTabs"
            :key="`${tab.elementNo}::${tab.elementName}::${tab.elementType}`"
            :label="tab.elementName"
            :name="`${tab.elementNo}::${tab.elementName}`"
            :closable="true"
            style="height: 100%; overflow: auto;"
          >
            <keep-alive>
              <!-- :element-no为当前测试元素的 elementNo -->
              <component
                :is="elementViews[tab.elementType]"
                :workspace-no="workspaceNo"
                :collection-no="activeCollectionNo"
                :group-no="activeGroupNo"
                :element-no="tab.elementNo"
                :action="tab.action"
                @re-query-collection="queryCollections"
                @re-query-group="queryGroups"
                @rename-tab="renameTab(arguments, tab)"
                @close-tab="removeTab(`${tab.elementNo}::${tab.elementName}`)"
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
import ScriptTree from './components/script-tree'
import CollectionEditor from './components/collection-editor'
import GroupEditor from './components/group-editor'
import HTTPSamplerEditor from './components/samplers/http-sampler-editor'

export default {
  name: 'ScriptEditor',

  components: { ScriptTree, CollectionEditor, GroupEditor, HTTPSamplerEditor },

  data() {
    return {
      workspaceNo: '',
      sidebarTabActiveName: 'collection',
      collectionList: [],
      activeCollectionNo: '',
      activeCollectionName: '',
      groupList: [],
      activeGroupNo: '',
      activeGroupName: '',
      elementViews: {
        activity: 'ActivityView',
        collection: 'CollectionEditor',
        group: 'GroupEditor',
        httpSampler: 'HTTPSamplerEditor'
      },
      editTabActiveNo: '',
      editTabActiveName: '',
      editTabs: []
    }
  },

  mounted: function() {
    // 存储路由跳转时传递的workspaceNo
    this.workspaceNo = this.$route.params.workspaceNo
    this.queryCollections()
  },

  methods: {
    clickCollectionCard(elementNo, elementName) {
      this.activeCollectionNo = elementNo
      this.activeCollectionName = elementName
    },
    moveToGroupList() {
      this.sidebarTabActiveName = 'group'
    },
    addTab(elementNo, elementName, elementType, action) {
      const tabs = this.editTabs
      const newTabName = `${elementNo}::${elementName}`
      let isAllowAdd = true
      tabs.forEach(tab => {
        const tabName = `${tab.elementNo}::${tab.elementName}`
        if (tabName === newTabName) {
          isAllowAdd = false
          this.editTabActiveNo = tab.elementNo
          this.editTabActiveName = `${tab.elementNo}::${tab.elementName}`
        }
      })
      if (isAllowAdd) {
        this.editTabs.push({
          elementNo: elementNo,
          elementName: elementName,
          elementType: elementType,
          action: action
        })
        this.editTabActiveNo = elementNo
        this.editTabActiveName = `${elementNo}::${elementName}`
      }
    },
    removeTab(removeTabName) {
      const tabs = this.editTabs
      let activeNo = ''
      let activeName = ''
      const activeTabName = this.editTabActiveName
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
      this.editTabActiveNo = activeNo
      this.editTabActiveName = `${activeNo}::${activeName}`
      this.editTabs = tabs.filter(tab => `${tab.elementNo}::${tab.elementName}` !== removeTabName)
    },
    renameTab(args, element) {
      element.elementName = args[0]
      this.editTabActiveName = `${element.elementNo}::${element.elementName}`
    },
    openNewCollectionTab() {
      this.addTab('0', '新增脚本', 'collection', 'CREATE')
    },
    openNewGroupTab() {
      this.addTab('0', '新增案例', 'group', 'CREATE')
    },
    openNewHttpSamplerTab() {
      this.addTab('0', '新增HTTP请求', 'httpSampler', 'CREATE')
    },
    openCollectionDetailTab() {
      if (!this.activeCollectionNo && !this.activeCollectionName) {
        return
      }
      this.addTab(this.activeCollectionNo, this.activeCollectionName, 'collection', 'QUERY')
    },
    openGroupDetailTab() {
      if (!this.activeGroupNo && !this.activeGroupName) {
        return
      }
      this.addTab(this.activeGroupNo, this.activeGroupName, 'group', 'QUERY')
    },
    queryCollections() {
      Element.queryElementAll({ workspaceNo: this.workspaceNo, elementType: 'COLLECTION' }).then(response => {
        const { result } = response
        this.collectionList = result
      }).catch(() => {})
    },
    queryGroups() {
      this.$refs.scriptTree.queryScriptTree(this.activeCollectionNo)
    },
    enableElement(elementNo, elementType) {
      if (!elementNo && !elementType) {
        return
      }
      Element.enableElement({ elementNo: elementNo }).then(response => {
        if (elementType === 'COLLECTION') {
          this.queryCollections()
        }
      }).catch(() => {})
    },
    disableElement(elementNo, elementType) {
      if (!elementNo && !elementType) {
        return
      }
      Element.disableElement({ elementNo: elementNo }).then(response => {
        if (elementType === 'COLLECTION') {
          this.queryCollections()
        }
      }).catch(() => {})
    },
    moveUpGroup() {
      if (!this.activeCollectionNo && !this.activeGroupNo) {
        return
      }
      Element.moveUpElementChildOrder({ parentNo: this.activeCollectionNo, childNo: this.activeGroupNo }).then(response => {
        this.queryGroups()
      }).catch(() => {})
    },
    moveDownGroup() {
      if (!this.activeCollectionNo && !this.activeGroupNo) {
        return
      }
      Element.moveDownElementChildOrder({ parentNo: this.activeCollectionNo, childNo: this.activeGroupNo }).then(response => {
        this.queryGroups()
      }).catch(() => {})
    },
    deleteCollection(elementNo) {
      this.$confirm(
        '确认删除？', '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      ).then(() => {
        Element.deleteElement({ elementNo: elementNo }).then(response => {
          const { result } = response
          result.forEach((deletedElement) => {
            const tabName = `${deletedElement.elementNo}::${deletedElement.elementName}`
            this.removeTab(tabName)
          })
          this.queryCollections()
          if (this.activeCollectionNo === elementNo) {
            this.activeCollectionNo = ''
            this.activeCollectionName = ''
            this.groupList = []
            this.activeGroupNo = ''
            this.activeGroupName = ''
          }
        }).catch(() => {})
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

    .el-tabs{
      height: 100%;
    }

    /*/deep/.el-tabs__content {*/
    /*  flex: 1;*/
    /*  overflow: auto !important;*/

    /*  height: 100%;*/
    /*}*/
  }

  .active-card {
    color: white;
    background-color: #409EFF;
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

  .collection-operation-container{
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

  .collection-list-container{
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;

    /deep/.el-card__body {
      padding: 15px;
    }
  }

  .collection-card{
    margin-bottom: 6px;
    user-select: none;

    &:hover {
      /*
       * <div @mouseover="mouseOver" @mouseleave="mouseLeave" :style="active">Hover over me!</div>
       * Vue({
       *  data: {
       *    active: ''
       *  },
       *  methods: {
       *      mouseOver: function(){this.active = 'background-color: #cccccc'},
       *      mouseLeave: function () {this.active = ''},
       *  }
       */
      /*background-color: #F5F5F5;*/
      border-color: #DCDCDC;
      border-radius: 12px;
    }
  }

  .collection-item {
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
  }

  .group-operation-container{
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

  .group-list-container{
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;

    /deep/.el-card__body {
      padding: 15px;
    }
  }

  .group-card{
    margin-bottom: 6px;
    user-select: none;

    &:hover {
      border-color: #DCDCDC;
      border-radius: 12px;
    }
  }

  .group-card-inner {
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
  }

  .more-operation-container{
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: center;

    i {
      font-size: 20px;
      cursor:pointer;
    }
  }

  .rotate-90{
    transform: rotate(90deg)
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
