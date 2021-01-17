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
            :element-no="tab.elementNo"
            :action="tab.action"
            @rename-tab="renameTab(arguments, tab)"
            @close-tab="removeTab(`${tab.elementNo}::${tab.elementName}`)"
            v-on="$listeners"
          />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CollectionEditor from './collection-editor'
import GroupEditor from './group-editor'
import HTTPSamplerEditor from './samplers/http-sampler-editor'

export default {
  name: 'MianEditor',
  components: { CollectionEditor, GroupEditor, HTTPSamplerEditor },
  inject: ['editorInfo'],
  data() {
    return {
      elementViews: {
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
    addTab(elementNo, elementName, elementType, action) {
      const tabs = this.editTabs
      const newTabName = `${elementNo}::${elementName}`
      let isAllowAdd = true
      tabs.forEach(tab => {
        const tabName = `${tab.elementNo}::${tab.elementName}`
        if (tabName === newTabName) {
          isAllowAdd = false
          this.editTabActiveNo = tab.elementNo
          this.editTabActiveName = `${tab.elementNo}::${tab.elementName}`
        }
      })
      if (isAllowAdd) {
        this.editTabs.push({
          elementNo: elementNo,
          elementName: elementName,
          elementType: elementType,
          action: action
        })
        this.editTabActiveNo = elementNo
        this.editTabActiveName = `${elementNo}::${elementName}`
      }
    },
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
