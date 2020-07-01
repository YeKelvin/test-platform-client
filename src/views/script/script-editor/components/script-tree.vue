<template>
  <div class="tree-container">
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
    >
      <span slot-scope="{ node, data }" class="">
        <span>{{ node.label }}</span>
        <el-divider direction="vertical" />
        <el-dropdown trigger="click" placement="bottom-start">
          <i class="el-icon-more rotate-90" />
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-video-play">运行</el-dropdown-item>
            <el-dropdown-item icon="el-icon-turn-off">禁用</el-dropdown-item>
            <el-dropdown-item icon="el-icon-turn-off">启用</el-dropdown-item>
            <el-dropdown-item icon="el-icon-copy-document">复制</el-dropdown-item>
            <el-dropdown-item icon="el-icon-delete">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
    </el-tree>

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
    }
  }
}
</script>

<style lang="scss" scoped>
  /*.tree-container {*/
  /*  display: block;*/
  /*  position: relative;*/
  /*}*/

</style>
