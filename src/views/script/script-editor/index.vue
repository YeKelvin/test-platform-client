<template>
  <div class="scrollbar script-editor-container">
    <manager ref="manager" @add-tab="addTab(arguments)" />
    <main-editor
      ref="editor"
      @re-query-collection="queryCollections"
      @re-query-group="queryGroups"
    />
  </div>
</template>

<script>
import Manager from './components/manager/index'
import MainEditor from './components/mian-editor/index'

export default {
  name: 'ScriptEditor',
  components: { Manager, MainEditor },
  provide() {
    return {
      editorInfo: this.editorInfo
    }
  },
  data() {
    return {
      editorInfo: {
        workspaceNo: '',
        collectionNo: '',
        elementNo: '',
        elementType: ''
      }
    }
  },
  mounted: function() {},
  methods: {
    addTab(args) {
      this.$refs.editor.addTab(...args)
    },
    queryCollections() {
      this.$refs.manager.queryCollections()
    },
    queryGroups() {
      this.$refs.manager.queryGroups()
    }
  }
}
</script>

<style lang="scss" scoped>
.script-editor-container {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;

  .el-tabs {
    height: 100%;
  }
}

</style>
