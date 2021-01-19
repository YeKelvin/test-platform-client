<template>
  <div class="tree-container">
    <el-tree
      ref="scriptTree"
      node-key="elementNo"
      empty-text="空脚本"
      highlight-current
      :indent="32"
      :data="scriptList"
      :props="treeProps"
      @node-click="handleNodeClick"
      @node-contextmenu="handleNodeContextmenu"
    >
      <div slot-scope="{ node, data }" class="tree-item-container">
        <span>{{ node.label }}</span>
        <div class="more-operation-container">
          <el-divider direction="vertical" />
          <el-dropdown trigger="click" placement="bottom-start">
            <i class="el-icon-more rotate-90" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-video-play">运行</el-dropdown-item>
              <el-dropdown-item v-if="data.enabled" icon="el-icon-turn-off" @click.native="disableElement(data.elementNo)">禁用</el-dropdown-item>
              <el-dropdown-item v-else icon="el-icon-turn-off" @click.native="enableElement(data.elementNo)">启用</el-dropdown-item>
              <el-dropdown-item icon="el-icon-copy-document">复制</el-dropdown-item>
              <el-dropdown-item icon="el-icon-delete" @click.native="deleteElement(data.elementNo)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-tree>

  </div>
</template>

<script>
import * as Element from '@/api/script/element'

export default {
  name: 'ScriptTree',
  inject: ['editorInfo'],
  data() {
    return {
      scriptList: [],
      treeProps: {
        label: 'elementName',
        children: 'children',
        disabled: 'enabled'
      },
      selectedNode: null
    }
  },
  watch: {
    'editorInfo.collectionNo'(value) {
      this.queryScriptTree(value)
    }
  },
  methods: {
    handleNodeClick(node) {
      this.editorInfo.elementNo = node.elementNo
      this.editorInfo.elementType = node.elementType
      // todo 打开详情页
      // this.$emit('add-tab')
    },
    handleNodeContextmenu(mouseEvent, data, node) {
      // todo 右键菜单
      console.log(mouseEvent)
      console.log(data)
      console.log(node)
    },
    queryScriptTree(elementNo) {
      Element.queryElementChildren({ elementNo: elementNo }).then(response => {
        const { result } = response
        this.scriptList = result
      }).catch(() => {})
    },
    enableElement(elementNo) {
      // todo 禁用启用元素还是有问题
      console.log('enableElement')
      console.log(elementNo)
      if (!elementNo) {
        return
      }
      Element.enableElement({ elementNo: elementNo }).then(response => {
        this.queryScriptTree(this.editorInfo.collectionNo)
      }).catch(() => {
      })
    },
    disableElement(elementNo) {
      // todo 禁用启用元素还是有问题
      console.log('disableElement')
      console.log(elementNo)
      if (!elementNo) {
        return
      }
      Element.disableElement({ elementNo: elementNo }).then(response => {
        this.queryScriptTree(this.editorInfo.collectionNo)
      }).catch(() => {
      })
    },
    deleteElement(elementNo) {
      this.$confirm('确认删除？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Element.deleteElement({ elementNo: elementNo }).then(response => {
          // todo 删除元素后需要关闭已经打开的tab
          // const { result } = response
          // result.forEach((deletedElement) => {
          //   const tabName = `${deletedElement.elementNo}::${deletedElement.elementName}`
          //   this.removeTab(tabName)
          // })
          this.queryScriptTree(this.editorInfo.collectionNo)
        }).catch(() => {})
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
  .tree-item-container {
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
  }

  .more-operation-container {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: center;
    padding-right: 10px;

    i {
      font-size: 20px;
      cursor: pointer;
    }
  }

</style>
