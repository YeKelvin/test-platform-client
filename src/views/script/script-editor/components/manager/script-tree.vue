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
      @node-contextmenu="handleRightClick"
    >
      <!-- <div slot-scope="{ node, data }" class="tree-item-container">
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
      </div> -->
    </el-tree>

    <transition name="el-zoom-in-top">
      <ul v-show="showMenu" ref="rightMenu" class="right-menu">
        <li class="menu-item"><i class="el-icon-video-play" />添加</li>
        <li class="menu-item"><i class="el-icon-turn-off" />启用</li>
        <li class="menu-item"><i class="el-icon-turn-off" />禁用</li>
        <li class="menu-item"><i class="el-icon-copy-document" />复制</li>
        <li class="menu-item"><i class="el-icon-delete" />删除</li>
      </ul>
    </transition>

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
      showMenu: false,
      currentRightClickNodeData: null
    }
  },

  watch: {
    'editorInfo.collectionNo'(value) {
      this.queryScriptTree(value)
    }
  },

  methods: {
    handleNodeClick(node) {
      this.showMenu = false
      this.editorInfo.elementNo = node.elementNo
      this.editorInfo.elementName = node.elementName
      this.editorInfo.elementType = node.elementType
      this.$emit('add-tab', node.elementNo, node.elementName, node.elementType, 'QUERY')
    },

    handleRightClick(mouseEvent, data, node, element) {
      this.showMenu = false // 再次右键时，先确保菜单是关闭状态后，再重新唤起
      this.showMenu = true
      this.$refs.rightMenu.style.left = mouseEvent.clientX + 15 + 'px'
      this.$refs.rightMenu.style.top = mouseEvent.clientY + 15 + 'px'
      document.addEventListener('click', this.closeRightMenu) // 添加鼠标监听事件，点击任意位置关闭菜单
      this.currentRightClickNodeData = data
    },

    closeRightMenu() {
      this.showMenu = false
      document.removeEventListener('click', this.closeRightMenu) // 移除鼠标监听事件
    },

    queryScriptTree(elementNo) {
      Element.queryElementChildren({ elementNo: elementNo }).then(response => {
        const { result } = response
        this.scriptList = result
      }).catch(() => {})
    },

    enableElement(elementNo) {
      // FIXME: 禁用启用元素还是有问题
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
      // FIXME: 禁用启用元素还是有问题
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
          // TODO: 删除元素后需要关闭已经打开的tab
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

.right-menu {
  padding-inline-start: 0;
  padding-top: 10px;
  padding-bottom: 10px;
  position: fixed;
  color: #606266;
  background: #fff;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  z-index: 999;
  list-style: none;

  li {
    cursor: pointer;
    padding-left: 30px;
    padding-right: 30px;
  }

  li:hover {
    background-color: #f0f7ff;
  }
}

.menu-item {
  line-height: 30px;
  padding: 0 17px;
  font-size: 14px;
  margin-top: 6px;

  &:before {
    height: 6px;
    margin: 0 -17px;
  }
}
</style>
