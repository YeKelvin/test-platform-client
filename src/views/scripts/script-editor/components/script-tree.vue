<template>
  <div>
    <el-tree
      ref="scripttree"
      node-key="elementNo"
      empty-text="空脚本"
      highlight-current
      :indent="32"
      :data="data"
      :props="defaultProps"
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
      @node-contextmenu="openMenu"
    >
      <span slot-scope="{ node, data }" class="">
        <span>{{ node.label }}</span>
      </span>
    </el-tree>

    <el-card v-show="menuVisible" ref="menu" class="menu-container">
      <span>
        <i class="el-icon-circle-plus-outline" />同级增加
      </span>
      <span class="delete">
        <i class="el-icon-remove-outline" />删除节点
      </span>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ScriptTree',

  data() {
    return {
      scriptList: [],
      treeProps: {
        label: 'elementName',
        children: 'children',
        disabled: ''
      },
      menuVisible: false,
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
      document.addEventListener('click', this.closeMenu)
      this.$refs.menu.$el.style.left = event.clientX + 40 + 'px'
      this.$refs.menu.$el.style.top = event.clientY + 10 + 'px'
    },
    closeMenu() {
      this.menuVisible = false
      document.removeEventListener('click', this.closeMenu)
    }
  }
}
</script>

<style lang="scss" scoped>
  .menu-container {
    width:120px;
    position:absolute;
    z-index:1000;
  }
</style>
