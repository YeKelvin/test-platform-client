<template>
  <div class="manager-container">
    <el-select v-model="workspaceNo" size="small" filterable placeholder="请选择工作空间">
      <el-option
        v-for="workspace in workspaces"
        :key="workspace.workspaceNo"
        :label="workspace.workspaceName"
        :value="workspace.workspaceNo"
      />
    </el-select>

    <el-divider />

    <el-select v-model="collectionNo" size="small" filterable placeholder="请选择脚本">
      <el-option
        v-for="collection in collections"
        :key="collection.elementNo"
        :label="collection.elementName"
        :value="collection.elementNo"
      >
        <span style="float: left">{{ collection.elementName }}</span>
        <span style="float: right" class="collection-item">
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
                <el-dropdown-item
                  v-if="collection.enabled"
                  icon="el-icon-turn-off"
                  @click.native="disableElement(collection.elementNo, collection.elementType)"
                >禁用
                </el-dropdown-item>
                <el-dropdown-item
                  v-else
                  icon="el-icon-turn-off"
                  @click.native="enableElement(collection.elementNo, collection.elementType)"
                >启用
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-delete" @click.native="deleteCollection(collection.elementNo)">删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </span>
      </el-option>
    </el-select>

    <el-divider />

    <el-tabs v-model="sidebarTabActiveName" :stretch="true">
      <el-tab-pane label="脚本" name="collection">
        <div class="collection-operation-container">
          <el-button type="text" icon="el-icon-plus" @click="openNewTCollectionab">新增脚本</el-button>
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
                    <el-dropdown-item
                      v-if="collection.enabled"
                      icon="el-icon-turn-off"
                      @click.native="disableElement(collection.elementNo, collection.elementType)"
                    >禁用
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-else
                      icon="el-icon-turn-off"
                      @click.native="enableElement(collection.elementNo, collection.elementType)"
                    >启用
                    </el-dropdown-item>
                    <el-dropdown-item icon="el-icon-delete" @click.native="deleteCollection(collection.elementNo)">删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </el-card>
        </div>
      </el-tab-pane>

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
        <el-button type="text" icon="el-icon-sort-up" @click="moveUp">上移</el-button>
        <el-divider direction="vertical" />
        <el-button type="text" icon="el-icon-sort-down" @click="moveDown">下移</el-button>
      </div>
      <el-divider />
    </el-tabs>
  </div>
</template>

<script>
import * as Element from '@/api/script/element'
import * as Workspace from '@/api/script/workspace'

export default {
  name: 'Manager',
  data() {
    return {
      workspaces: [],
      workspaceNo: '',
      collections: [],
      collectionNo: ''
    }
  },
  mounted: function() {
    this.queryWorkspaceAll()
    if (this.workspaceNo) {
      this.queryCollections()
    }
  },
  methods: {
    queryWorkspaceAll() {
      Workspace.queryWorkspaceAll().then(response => {
        const { result } = response
        this.workspaces = result
      }).catch(() => {
      })
    },
    queryCollections() {
      Element.queryElementAll({ workspaceNo: this.workspaceNo, elementType: 'COLLECTION' }).then(response => {
        const { result } = response
        this.collections = result
      }).catch(() => {
      })
    },
    moveUpGroup() {
      if (!this.activeCollectionNo && !this.activeGroupNo) {
        return
      }
      Element.moveUpElementChildOrder({
        parentNo: this.activeCollectionNo,
        childNo: this.activeGroupNo
      }).then(response => {
        this.queryGroups()
      }).catch(() => {
      })
    },
    moveDownGroup() {
      if (!this.activeCollectionNo && !this.activeGroupNo) {
        return
      }
      Element.moveDownElementChildOrder({
        parentNo: this.activeCollectionNo,
        childNo: this.activeGroupNo
      }).then(response => {
        this.queryGroups()
      }).catch(() => {
      })
    },
    openNewGroupTab() {
      this.addTab('0', '新增案例', 'group', 'CREATE')
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
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    enableElement(elementNo, elementType) {
      if (!elementNo && !elementType) {
        return
      }
      Element.enableElement({ elementNo: elementNo }).then(response => {
        if (elementType === 'COLLECTION') {
          this.queryCollections()
        }
      }).catch(() => {
      })
    },
    disableElement(elementNo, elementType) {
      if (!elementNo && !elementType) {
        return
      }
      Element.disableElement({ elementNo: elementNo }).then(response => {
        if (elementType === 'COLLECTION') {
          this.queryCollections()
        }
      }).catch(() => {
      })
    },
    openCollectionDetailTab() {
      if (!this.activeCollectionNo && !this.activeCollectionName) {
        return
      }
      this.addTab(this.activeCollectionNo, this.activeCollectionName, 'collection', 'QUERY')
    },
    moveToGroupList() {
      this.sidebarTabActiveName = 'group'
    },
    clickCollectionCard(elementNo, elementName) {
      this.activeCollectionNo = elementNo
      this.activeCollectionName = elementName
    },
    openNewCollectionTab() {
      this.addTab('0', '新增脚本', 'collection', 'CREATE')
    }
  }
}
</script>

<style lang="scss" scoped>
.manager-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  max-width: 400px;
  padding: 12px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

  .el-divider--horizontal {
    margin: 5px 0
  }
}
</style>
