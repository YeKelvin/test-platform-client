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
        <span style="float: right">
          <span v-if="!collection.enabled" style="margin-left: 10px">
            <el-tag type="danger" size="mini">已禁用</el-tag>
          </span>
        </span>
      </el-option>
    </el-select>
    <el-divider />

    <div class="operation-container">
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

    <script-tree ref="scriptTree" />
  </div>
</template>

<script>
import * as Element from '@/api/script/element'
import * as Workspace from '@/api/script/workspace'

import ScriptTree from './script-tree'

export default {
  name: 'Manager',
  components: { ScriptTree },
  inject: ['editorInfo'],
  data() {
    return {
      workspaces: [],
      workspaceNo: '',
      collections: [],
      collectionNo: ''
    }
  },
  watch: {
    workspaceNo(value) {
      // todo 非空判断
      this.editorInfo.workspaceNo = value
      this.queryCollections()
    },
    collectionNo(value) {
      // todo 非空判断
      this.editorInfo.collectionNo = value
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
    queryGroups() {
      this.$refs.scriptTree.queryScriptTree(this.activeCollectionNo)
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
    addTab(elementNo, elementName, elementType, action) {
      this.$emit('add-tab', elementNo, elementName, elementType, action)
    },
    openNewGroupTab() {
      this.addTab('0', '新增案例', 'group', 'CREATE')
    },
    openNewCollectionTab() {
      this.addTab('0', '新增脚本', 'collection', 'CREATE')
    },
    openNewHttpSamplerTab() {
      this.addTab('0', '新增HTTP请求', 'httpSampler', 'CREATE')
    },
    openCollectionDetailTab() {
      this.addTab(this.editorInfo.elementNo, this.editorInfo.elementName, 'collection', 'QUERY')
    },
    openGroupDetailTab() {
      this.addTab(this.editorInfo.elementNo, this.editorInfo.elementName, 'group', 'QUERY')
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
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  .el-button--text {
    padding-top: 6px;
    padding-bottom: 6px;
  }
}

</style>
