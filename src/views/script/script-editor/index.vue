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
              <el-button type="text" icon="el-icon-view" @click="addCollectionDetailTab">详情</el-button>
            </div>
            <el-divider />
            <div class="collection-list-container">
              <el-card
                v-for="collection in collectionList"
                :key="collection.elementNo"
                class="collection-card"
                :class="{'active-card':activeCollectionNo===collection.elementNo && activeCollectionName===collection.elementName}"
                @click.native="activateCollectionCard(collection.elementNo, collection.elementName)"
                @dblclick.native="changeToGroupSidebarTab"
              >
                <div class="collection-card-inner">
                  {{ collection.elementName }}
                  <span v-if="!collection.enabled" style="margin-left: 10px">
                    <el-tag type="danger" size="mini">已禁用</el-tag>
                  </span>
                  <div class="more-operation-container">
                    <el-divider direction="vertical" />
                    <el-dropdown trigger="click" placement="bottom-start">
                      <i class="el-icon-more rotate-90" />
                      <el-dropdown-menu slot="dropdown">
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

          <el-tab-pane label="测试案例" name="group" :disabled="!activeCollectionNo&&!activeCollectionName">
            <div class="group-operation-button-container">
              <el-button type="text" icon="el-icon-plus" @click="addCreateGroupTab">新增</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" icon="el-icon-view" @click="addGroupDetailTab">详情</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" icon="el-icon-sort-up" @click="moveUpGroup">上移</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" icon="el-icon-sort-down" @click="moveDownGroup">下移</el-button>
            </div>
            <el-divider />
            <div class="group-list-container">
              <el-card
                v-for="group in groupList"
                :key="group.elementNo"
                class="group-card"
                :class="{'active-card':activeGroupNo===group.elementNo && activeGroupName===group.elementName}"
                @click.native="activateGroupCard(group.elementNo, group.elementName)"
                @dblclick.native="changeToSamplerSidebarTab"
              >
                <div class="group-card-inner">
                  {{ group.elementName }}
                  <span v-if="!group.enabled" style="margin-left: 10px">
                    <el-tag type="danger" size="mini">已禁用</el-tag>
                  </span>
                  <div class="more-operation-container">
                    <el-divider direction="vertical" />
                    <el-dropdown trigger="click" placement="bottom-start">
                      <i class="el-icon-more rotate-90" />
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-video-play">运行</el-dropdown-item>
                        <el-dropdown-item v-if="group.enabled" icon="el-icon-turn-off" @click.native="disableElement(group.elementNo, group.elementType)">禁用</el-dropdown-item>
                        <el-dropdown-item v-else icon="el-icon-turn-off" @click.native="enableElement(group.elementNo, group.elementType)">启用</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-copy-document" @click.native="duplicateGroup(group.elementNo)">复制</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-delete" @click.native="deleteGroup(group.elementNo)">删除</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
              </el-card>
            </div>
          </el-tab-pane>

          <el-tab-pane label="取样器" name="sampler" :disabled="!activeGroupNo&&!activeGroupName">
            <div class="sampler-operation-button-container">
              <el-button type="text" icon="el-icon-plus" @click="addCreateSamplerTab">新增</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" icon="el-icon-view" @click="addSamplerDetailTab">详情</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" icon="el-icon-sort-up" @click="moveUpSampler">上移</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" icon="el-icon-sort-down" @click="moveDownSampler">下移</el-button>
            </div>
            <el-divider />
            <div class="sampler-list-container">
              <el-card
                v-for="sampler in samplerList"
                :key="sampler.elementNo"
                class="sampler-card"
                :class="{'active-card':activeSamplerNo===sampler.elementNo && activeSamplerName===sampler.elementName}"
                @click.native="activateSamplerCard(sampler.elementNo, sampler.elementName)"
                @dblclick.native="addSamplerDetailTab"
              >
                <div class="sampler-card-inner">
                  {{ sampler.elementName }}
                  <span v-if="!sampler.enabled" style="margin-left: 10px">
                    <el-tag type="danger" size="mini">已禁用</el-tag>
                  </span>
                  <div class="more-operation-container">
                    <el-divider direction="vertical" />
                    <el-dropdown trigger="click" placement="bottom-start">
                      <i class="el-icon-more rotate-90" />
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-video-play">运行</el-dropdown-item>
                        <el-dropdown-item v-if="sampler.enabled" icon="el-icon-turn-off" @click.native="disableElement(sampler.elementNo, sampler.elementType)">禁用</el-dropdown-item>
                        <el-dropdown-item v-else icon="el-icon-turn-off" @click.native="enableElement(sampler.elementNo, sampler.elementType)">启用</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-copy-document" @click.native="duplicateSampler(sampler.elementNo)">复制</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-delete" @click.native="deleteSampler(sampler.elementNo)">删除</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
              </el-card>
            </div>
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
              <!-- :element-no为当前测试元素的 elementNo -->
              <component
                :is="elementViews[element.elementType]"
                :item-no="itemNo"
                :collection-no="activeCollectionNo"
                :group-no="activeGroupNo"
                :sampler-no="activeSamplerNo"
                :element-no="element.elementNo"
                :action="element.action"
                @re-query-collection="queryCollections"
                @re-query-group="queryGroupsByCollection"
                @re-query-sampler="querySamplersByGroup"
                @rename-tab="renameTab(arguments, element)"
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
      activeCollectionNo: '',
      activeCollectionName: '',
      groupList: [],
      activeGroupNo: '',
      activeGroupName: '',
      samplerList: [],
      activeSamplerNo: '',
      activeSamplerName: '',
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
    this.queryCollections()
  },

  methods: {
    activateCollectionCard(elementNo, elementName) {
      this.activeCollectionNo = elementNo
      this.activeCollectionName = elementName
    },
    activateGroupCard(elementNo, elementName) {
      this.activeGroupNo = elementNo
      this.activeGroupName = elementName
    },
    activateSamplerCard(elementNo, elementName) {
      this.activeSamplerNo = elementNo
      this.activeSamplerName = elementName
    },
    changeToGroupSidebarTab() {
      this.elementSidebarTabActiveName = 'group'
      this.queryGroupsByCollection()
    },
    changeToSamplerSidebarTab() {
      this.elementSidebarTabActiveName = 'sampler'
    },
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
          this.editElementTabActiveNo = tab.elementNo
          this.editElementTabActiveName = `${tab.elementNo}::${tab.elementName}`
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
    renameTab(args, element) {
      element.elementName = args[0]
      this.editElementTabActiveName = `${element.elementNo}::${element.elementName}`
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
    addCollectionDetailTab() {
      if (!this.activeCollectionNo && !this.activeCollectionName) {
        return
      }
      this.addTab(this.activeCollectionNo, this.activeCollectionName, 'collection', 'QUERY')
    },
    addGroupDetailTab() {
      if (!this.activeGroupNo && !this.activeGroupName) {
        return
      }
      this.addTab(this.activeGroupNo, this.activeGroupName, 'group', 'QUERY')
    },
    addSamplerDetailTab() {
      if (!this.activeSamplerNo && !this.activeSamplerName) {
        return
      }
      this.addTab(this.activeSamplerNo, this.activeSamplerName, 'sampler', 'QUERY')
    },
    queryCollections() {
      Element.queryElementAll({ itemNo: this.itemNo, elementType: 'COLLECTION' }).then(response => {
        const { result } = response
        this.collectionList = result
      }).catch(() => {})
    },
    queryGroupsByCollection() {
      Element.queryElementChild({ elementNo: this.activeCollectionNo, elementType: 'GROUP' }).then(response => {
        const { result } = response
        this.groupList = result
      }).catch(() => {})
    },
    querySamplersByGroup() {
      Element.queryElementChild({ elementNo: this.activeSamplerNo, elementType: 'SAMPLER' }).then(response => {
        const { result } = response
        this.samplerList = result
      }).catch(() => {})
    },
    enableElement(elementNo, elementType) {
      if (!elementNo && !elementType) {
        return
      }
      Element.enableElement({ elementNo: elementNo }).then(response => {
        if (elementType === 'COLLECTION') {
          this.queryCollections()
        } else if (elementType === 'GROUP') {
          this.queryGroupsByCollection()
        } else if (elementType === 'SAMPLER') {
          this.querySamplersByGroup()
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
        } else if (elementType === 'GROUP') {
          this.queryGroupsByCollection()
        } else if (elementType === 'SAMPLER') {
          this.querySamplersByGroup()
        }
      }).catch(() => {})
    },
    moveUpGroup() {
      if (!this.activeCollectionNo && !this.activeGroupNo) {
        return
      }
      Element.moveUpElementChildOrder(
        { parentNo: this.activeCollectionNo, childNo: this.activeGroupNo }
      ).then(response => {
        this.queryGroupsByCollection()
      }).catch(() => {
      })
    },
    moveDownGroup() {
      if (!this.activeCollectionNo && !this.activeGroupNo) {
        return
      }
      Element.moveDownElementChildOrder(
        { parentNo: this.activeCollectionNo, childNo: this.activeGroupNo }
      ).then(response => {
        this.queryGroupsByCollection()
      }).catch(() => {
      })
    },
    moveUpSampler() {
      if (!this.activeGroupNo && !this.activeSamplerNo) {
        return
      }
      Element.moveUpElementChildOrder(
        { parentNo: this.activeGroupNo, childNo: this.activeSamplerNo }
      ).then(response => {
        this.querySamplersByGroup()
      }).catch(() => {
      })
    },
    moveDownSampler() {
      if (!this.activeGroupNo && !this.activeSamplerNo) {
        return
      }
      Element.moveDownElementChildOrder(
        { parentNo: this.activeGroupNo, childNo: this.activeSamplerNo }
      ).then(response => {
        this.querySamplersByGroup()
      }).catch(() => {
      })
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
          this.activeCollectionNo = ''
          this.activeCollectionName = ''
          this.groupList = []
          this.activeGroupNo = ''
          this.activeGroupName = ''
          this.samplerList = []
          this.activeSamplerNo = ''
          this.activeSamplerName = ''
        }).catch(() => {})
      }).catch(() => {})
    },
    deleteGroup(elementNo) {
      this.$confirm(
        '确认删除？', '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      ).then(() => {
        Element.deleteElement({ elementNo: elementNo }).then(response => {
          const { result } = response
          result.forEach((deletedElement) => {
            const tabName = `${deletedElement.elementNo}::${deletedElement.elementName}`
            this.removeTab(tabName)
          })
          this.queryGroupsByCollection()
          this.activeGroupNo = ''
          this.activeGroupName = ''
          this.samplerList = []
          this.activeSamplerNo = ''
          this.activeSamplerName = ''
        }).catch(() => {})
      }).catch(() => {})
    },
    deleteSampler(elementNo) {
      this.$confirm(
        '确认删除？', '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      ).then(() => {
        Element.deleteElement({ elementNo: elementNo }).then(response => {
          const { result } = response
          result.forEach((deletedElement) => {
            const tabName = `${deletedElement.elementNo}::${deletedElement.elementName}`
            this.removeTab(tabName)
          })
          this.querySamplersByGroup()
          this.activeSamplerNo = ''
          this.activeSamplerName = ''
        }).catch(() => {})
      }).catch(() => {})
    },
    duplicateGroup(elementNo) {
      this.$confirm(
        '确认复制？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      ).then(() => {
        // Element.duplicateElement({ elementNo: elementNo }).then(response => {
        // }).catch(() => {})

        this.queryGroupsByCollection()
      }).catch(() => {})
    },
    duplicateSampler(elementNo) {
      this.$confirm(
        '确认复制？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      ).then(() => {
        // Element.duplicateElement({ elementNo: elementNo }).then(response => {
        // }).catch(() => {})

        this.querySamplersByGroup()
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

  .collection-card-inner {
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
  }

  .group-operation-button-container{
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

  .sampler-operation-button-container{
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

  .sampler-list-container{
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;

    /deep/.el-card__body {
      padding: 15px;
    }
  }

  .sampler-card{
    margin-bottom: 6px;

    &:hover {
      border-color: #DCDCDC;
      border-radius: 12px;
    }
  }

  .sampler-card-inner {
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
