<template>
  <div>
    <el-tree
      ref="scriptTree"
      node-key="elementNo"
      empty-text="空脚本"
      highlight-current
      :indent="32"
      :data="data"
      :props="defaultProps"
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
      @node-contextmenu="rihgtClick"
    >
      <span slot-scope="{ node, data }" class="">
        <span>{{ node.label }}</span>
      </span>
    </el-tree>

    <div v-show="menuVisible">
      <el-menu
        id="rightClickMenu"
        class="el-menu-vertical"
        active-text-color="#fff"
        text-color="#fff"
      >
        <el-menu-item index="1" class="menuItem">
          <span slot="title">新增</span>
        </el-menu-item>
        <el-menu-item index="2" class="menuItem">
          <span slot="title">禁用</span>
        </el-menu-item>
        <el-menu-item index="4" class="menuItem">
          <span slot="title">删除</span>
        </el-menu-item>
      </el-menu>
    </div>

  </div>
</template>

<script>
export default {
  name: 'BatchExecution',
  data() {
    return {
      scriptList: [],
      treeProps: {
        label: 'elementName',
        children: 'children',
        disabled: 'enabled'
      },
      menuVisible: false,
      selectedNode: null,
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      // data: JSON.parse(JSON.stringify(data))
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
    },
    openMenu(event, object, node, element) {
      this.menuVisible = true
      this.selectedNode = node
      document.addEventListener('click', this.closeMenu)
      this.$refs.rightMenu.$el.style.left = event.clientX + 40 + 'px'
      this.$refs.rightMenu.$el.style.top = event.clientY + 10 + 'px'
    },
    closeMenu() {
      this.menuVisible = false
      document.removeEventListener('click', this.closeMenu)
    },
    rihgtClick(event, object, value, element) {
      this.menuVisible = true
      document.addEventListener('click', (e) => {
        this.menuVisible = false
      })
      const menu = document.querySelector('#rightClickMenu')
      console.log(menu)
      /* 菜单定位基于鼠标点击位置 */
      menu.style.left = event.clientX + 2 + 'px'
      menu.style.top = event.clientY - 3 + 'px'
      menu.style.position = 'absolute'
      menu.style.width = 160 + 'px'
    }
  }
}
</script>

<style lang="scss" scoped>
  .menu-container {
    position: absolute;
    z-index: 9999;
  }

  .el-menu-vertical{
    border: 3px solid rgb(84, 92, 100);
    border-radius: 10px;
    z-index: 100;
  }
  .el-menu-vertical i{
    color: #777777;
  }
  .menuItem{
    height: 40px;
    line-height: 40px;
    background-color: #545c64;
  }
  .menuItem:hover{
    background-color: #409EFF;
  }
</style>
