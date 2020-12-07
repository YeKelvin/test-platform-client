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

    <el-select v-model="collectionNo" size="small" clearable filterable placeholder="请选择脚本">
      <el-option
        v-for="collection in collections"
        :key="collection.elementNo"
        :label="collection.elementName"
        :value="collection.elementNo"
      >
        <span style="float: left">{{ collection.elementName }}</span>
        <span style="float: right">
          <span v-if="!collection.enabled" style="margin-left: 10px">
            <el-tag type="danger" size="mini">已禁用</el-tag>
          </span>
        </span>
      </el-option>
    </el-select>

    <el-divider />

    <div class="group-operation-container">
      <el-dropdown trigger="click" placement="bottom-start">
        <span class="el-dropdown-link">
          <el-button type="text" icon="el-icon-plus">新增</el-button>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="openNewCollectionTab">新增脚本</el-dropdown-item>
          <el-dropdown-item divided @click.native="openNewGroupTab">测试案例</el-dropdown-item>
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
    <!--    {{ editorInfo.elementNo }}-->
  </div>
</template>

<script>
import * as Element from '@/api/script/element'
import * as Workspace from '@/api/script/workspace'

export default {
  name: 'Manager',
  inject: ['editorInfo'],
  data() {
    return {
      workspaces: [],
      workspaceNo: '',
      collections: [{
        elementNo: '123',
        elementName: 'testName'
      }],
      collectionNo: ''
    }
  },
  watch: {
    collectionNo(value) {
      this.editorInfo.elementNo = value
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
    moveUp() {
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
    moveDown() {
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
    addTab() {
      this.$emit('add-tab', '子向父组件传值')
    },
    openNewGroupTab() {
      this.addTab('0', '新增案例', 'group', 'CREATE')
    },
    openCollectionDetailTab() {
      if (!this.activeCollectionNo && !this.activeCollectionName) {
        return
      }
      this.addTab(this.activeCollectionNo, this.activeCollectionName, 'collection', 'QUERY')
    },
    openNewCollectionTab() {
      this.addTab('0', '新增脚本', 'collection', 'CREATE')
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

.operation-container {
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
</style>
