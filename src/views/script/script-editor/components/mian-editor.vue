<template>
  <div class="main-editor-container">
    <el-tabs v-model="editTabActiveName" type="card" @tab-remove="removeTab">
      <el-tab-pane
        v-for="tab in editTabs"
        :key="`${tab.elementNo}::${tab.elementName}::${tab.elementType}`"
        :label="tab.elementName"
        :name="`${tab.elementNo}::${tab.elementName}`"
        :closable="true"
        style="height: 100%; overflow: auto;"
      >
        <keep-alive>
          <!-- :element-no为当前测试元素的 elementNo -->
          <component
            :is="elementViews[tab.elementType]"
            :workspace-no="editorInfo.workspaceNo"
            :collection-no="editorInfo.CollectionNo"
            :group-no="activeGroupNo"
            :element-no="tab.elementNo"
            :action="tab.action"
            @re-query-collection="queryCollections"
            @re-query-group="queryGroups"
            @rename-tab="renameTab(arguments, tab)"
            @close-tab="removeTab(`${tab.elementNo}::${tab.elementName}`)"
          />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    <!--    {{ editorInfo.elementNo }}-->
    <!--    <input v-model="editorInfo.elementNo" type="text">-->
  </div>
</template>

<script>

export default {
  name: 'MianEditor',
  components: {},
  inject: ['editorInfo'],
  data() {
    return {
      elementViews: {
        activity: 'ActivityView',
        collection: 'CollectionEditor',
        group: 'GroupEditor',
        httpSampler: 'HTTPSamplerEditor'
      },
      editTabActiveNo: '',
      editTabActiveName: '',
      editTabs: []
    }
  },
  mounted: function() {},
  methods: {
    removeTab(removeTabName) {
      const tabs = this.editTabs
      let activeNo = ''
      let activeName = ''
      const activeTabName = this.editTabActiveName
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
      this.editTabActiveNo = activeNo
      this.editTabActiveName = `${activeNo}::${activeName}`
      this.editTabs = tabs.filter(tab => `${tab.elementNo}::${tab.elementName}` !== removeTabName)
    },
    renameTab(args, element) {
      element.elementName = args[0]
      this.editTabActiveName = `${element.elementNo}::${element.elementName}`
    }
  }
}
</script>

<style lang="scss" scoped>
.main-editor-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  margin-left: 6px;
}
</style>
