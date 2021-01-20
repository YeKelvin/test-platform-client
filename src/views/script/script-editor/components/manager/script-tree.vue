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

    <div v-show="showMenu" ref="rightMenu" class="right-menu">
      <div><i class="el-icon-circle-plus-outline" />添加</div>
      <div><i class="el-icon-edit" />修改</div>
      <div><i class="el-icon-remove-outline" />删除</div>
    </div>
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
      showMenu: false
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
      this.editorInfo.elementType = node.elementType
      // TODO: 打开详情页
      // this.$emit('add-tab')
    },
    handleRightClick(mouseEvent, data, node, element) {
      // TODO: 右键菜单
      this.showMenu = false // 先把菜单关死，目的是：第二次或者第n次右键鼠标的时候 它默认的是true
      this.showMenu = true
      this.$refs.rightMenu.style.left = mouseEvent.clientX + 15 + 'px'
      this.$refs.rightMenu.style.top = mouseEvent.clientY + 15 + 'px'
      // 给整个document添加监听鼠标事件，点击任何位置执行closeRightMenu方法，及时将菜单关闭
      document.addEventListener('click', this.closeRightMenu)
    },
    closeRightMenu() {
      this.showMenu = false
      // 及时关掉鼠标监听事件
      document.removeEventListener('click', this.closeRightMenu)
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
  padding: 10px;
  position: fixed;
  background: #fff;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  z-index: 999;
}
</style>
